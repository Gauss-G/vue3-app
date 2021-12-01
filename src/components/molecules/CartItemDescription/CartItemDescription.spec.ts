import { render } from '@testing-library/vue'
import CartItemDescription from './CartItemDescription.vue'

test('CartItemDescription rendered properly', async() => {
  const { container } = render(
    CartItemDescription,
    {
      props: {
        error: 'error',
      },
    },
  )

  expect(container.firstChild).toHaveClass('-error')
})
