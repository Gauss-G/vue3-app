import base from 'composables/base'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/components/atoms/IToast/index'
import product from '@/composables/product/product'
import { addShoippingCartByProducts } from '@/composables/shoppingBag/shoppingBag'
import gioHooks from '@/utils/hooks/gio'
import { generateLink } from '@/utils/index'
const { getProductsByIdList, getProductInfo, resolveProductAttribute } = product()

const comparisonControl = () => {
  const { gio } = gioHooks()
  const {
    t,
    locale,
    $store,
  } = base()

  const route = useRoute()
  const query: {
    ids?: string
    catid?: string
  } = route.query

  const productIds = ref<string[]>([])
  const products = ref<any[]>([])
  const hideIds = ref<any[]>([])
  const categoryId = ref<string>('')
  const requesting = ref<boolean>(false)
  const ready = ref<boolean>(false)

  const displayProducts = computed(() => {
    return products.value.filter((item: any) => !item.hide)
  })

  if (query.ids) {
    const queryIds: string[] = query.ids.split(',')
    productIds.value = queryIds
  }

  if (query.catid)
    categoryId.value = query.catid

  const replaceState = () => {
    const ids = productIds.value.join(',')
    let url = location.pathname
    url += `?ids=${ids}&catid=${route.query.catid}`
    history.replaceState({
      ids,
      catid: route.query.catid,
    }, 'comparison', url)
  }

  const detectInList = (id: string): boolean => {
    for (let i = 0; i < products.value.length; i++) {
      const item = products.value[i]
      if (item.id === id)
        return true
    }
    return false
  }

  const fetchProductDetail = async(id: string, type: string) => {
    requesting.value = true
    try {
      const { data } = await getProductInfo(id, type)
      requesting.value = false
      return data
    }

    catch (err) {
      requesting.value = false
    }
    return null
  }

  const fetchProductsByIds = async(ids: string[]) => {
    if (ids.length === 0) return
    $store.dispatch('Common/SET_PAGE_LOADING', true)
    const { data } = await getProductsByIdList(ids)
    if (data && data.length > 0) {
      for (const item of data) {
        const detailData = await fetchProductDetail(item.id, item.itemType)
        if (detailData && !detectInList(item.id)) {
          products.value.push({
            ...item,
            ...resolveProductAttribute(detailData),
          })
        }
      }
    }
    $store.dispatch('Common/SET_PAGE_LOADING', false)
  }

  const addProduct = async(id: string) => {
    await fetchProductsByIds([id])
  }

  const goToCart = () => {
    location.href = generateLink('/pay/cart', locale.value)
  }

  const removeProduct = async(item: any, idx: number) => {
    let timeoutId: any = null

    // 将删除对象设置为hide
    products.value = products.value.map((product: any) => {
      if (product.id === item.id)
        product.hide = true
      return product
    })

    gio.trackClickData({
      trackId: `product-click.${idx}`,
      trackLabel: item.name,
      moduleId: `comparison-item.${idx}`,
      moduleName: '商品对比功能',
      productInfo: item.type === 'SPR' ? `s${item.id}` : item.id,
      productName: item.name,
      modulePosition_var: idx,
      clickType: '删除商品',
    })

    const cancel = () => {
      // 恢复删除对象，并取消定时
      products.value = products.value.map((product: any) => {
        if (product.id === item.id)
          product.hide = false
        return product
      })
      if (timeoutId)
        clearTimeout(timeoutId)
    }

    toast({
      text: `${item.name} ${t('comparison.deleted')}`,
      actionTxt: t('public.cancel'),
      clickAction: cancel,
      duration: 3000,
      showClose: true,
      position: 'right',
    })

    // 设置3秒后删除对象
    timeoutId = setTimeout(() => {
      products.value = products.value.filter((product: any) => product.id !== item.id)
    }, 3000)
  }

  const removeAll = () => {
    productIds.value = []
    products.value = []
    hideIds.value = []
  }

  const addToBag = async(event: {
    target: any
    item: any
    trackId: string
    trackData: any
  }) => {
    const { item, trackId, trackData = {} } = event
    const gioData = {
      productDetail: item,
      quantity: 1,
      trackId,
    }
    try {
      const res: any = await addShoippingCartByProducts([item])
      if (res.isSuccess) {
        gio.trackAddToCart(gioData, { ...trackData },
        )
        toast({
          text: `${item.name} ${t('cart.add_your_cart')}`,
          duration: 3000,
          position: 'right',
          backgroundColor: '#0058A3',
          actionTxt: t('operation.see'),
          clickAction: goToCart,
        })
        $store.dispatch('ShopCart/SET_CART_LIST')
      }
      else {
        gio.trackAddToCart(gioData,
          {
            ...trackData,
            failReason_var: '用户未登陆',
          },
        )

        if (res?.message?.response?.status === 401) {
          localStorage.setItem('redirect_uri', location.href)
          location.href = generateLink('/profile/login', locale.value)
        }
      }
    }
    catch (err) {
      gio.trackAddToCart(gioData,
        {
          ...trackData,
          failReason_var: t('cart.failed_to_add_shopping_bag'),
        },
      )
      toast({ text: t('cart.failed_to_add_shopping_bag'), duration: 3000, position: 'right' })
    }
  }

  watch(() => products.value, (list) => {
    const ids: any[] = []
    list.forEach((item) => {
      if (item.itemType && item.itemType.toLowerCase() === 'spr')
        ids.push(`s${item.id}`)

      else
        ids.push(item.id)
    })
    productIds.value = ids
    replaceState()
  })

  onMounted(async() => {
    gio.trackPageViewEvent({})
    await fetchProductsByIds(productIds.value)
    ready.value = true
  })

  return {
    ready,
    requesting,
    productIds,
    displayProducts,
    categoryId,
    products,
    addProduct,
    removeProduct,
    removeAll,
    addToBag,
  }
}

export default comparisonControl
