import { render } from '@testing-library/vue'
import IFormItem from './IFormItem.vue'

test('IFormItem rendered properly', async() => {
  const { container } = render(
    IFormItem,
    {
      props: {
        error: 'error',
      },
    },
  )

  expect(container.firstChild).toHaveClass('-error')
})
