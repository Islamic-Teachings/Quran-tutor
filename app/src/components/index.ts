import { NavOptions } from './ResponsiveContainer'
import { Quran } from './Quran'
import { Context } from './Content'
import Logo from '../images/logo.svg'
import QuranLogo from '../images/quran.svg'


export const defaultNavOptions: NavOptions = {
  items: [{
    name: '',
    url: '/',
    icon: Logo,
    component: Context
  }, {
    name: 'Quran',
    url: '/quran',
    icon: QuranLogo,
    component: Quran
  }],
  loggedIn: false
}

export { ResponsiveContainer } from './ResponsiveContainer'
export { HomepageHeading } from './HomepageHeading'
