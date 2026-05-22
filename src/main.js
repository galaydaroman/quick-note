import './style.css'
import { setupTheme } from './modules/themeService'
import { setupEditor, loadContent } from './modules/contentService'
import './components/ContentNavigator'

setupTheme()
loadContent()
setupEditor()
