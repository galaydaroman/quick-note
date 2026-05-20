import './style.css'
import { setupTheme } from './modules/themeService'
import { contentAutoSaver, loadContent } from './modules/contentService'

setupTheme()
loadContent()
contentAutoSaver()
