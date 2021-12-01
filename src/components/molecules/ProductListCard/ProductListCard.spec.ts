import { render } from '@testing-library/vue'
import ProductListCard from './ProductListCard.vue'

test('ProductListCard rendered properly', async() => {
  const { container } = render(
    ProductListCard,
    {
      props: {
        error: 'error',
      },
    },
  )

  expect(container.firstChild).toHaveClass('-error')
})
