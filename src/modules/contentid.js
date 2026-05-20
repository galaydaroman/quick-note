import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'

export default customAlphabet(alphanumeric, 4)
