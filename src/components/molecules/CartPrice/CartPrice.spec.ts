import { render } from '@testing-library/vue'
import CartPrice from './CartPrice.vue'

test('CartPrice rendered properly', async() => {
  const { container } = render(
    CartPrice,
    {
      props: {
        error: 'error',
      },
    },
  )

  expect(container.firstChild).toHaveClass('-error')
})
