import { render } from '@testing-library/vue'
import CartProductItem from './CartProductItem.vue'

test('CartProductItem rendered properly', async() => {
  const { container } = render(
    CartProductItem,
    {
      props: {
        error: 'error',
      },
    },
  )

  expect(container.firstChild).toHaveClass('-error')
})
