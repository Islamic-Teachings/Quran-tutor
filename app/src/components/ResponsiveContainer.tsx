import React, { Component, FunctionComponent } from 'react'
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react'

import { HomepageHeading } from './HomepageHeading'

if (!('mobilecheck' in window)) {
  //@ts-ignore
  window.mobilecheck = () => {
    var check = false;
    ((a) => { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
  };
}

type DesktopState = {
  fixed: boolean,
  activeItem: NavItem
}

const getWidth = (): number => {
  const isSSR = typeof window === 'undefined'
  //@ts-ignore
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

export type NavItem = {
  name: string,
  url: string,
  component: PropTypes.ReactElementLike | PropTypes.ReactComponentLike,
  icon?: any
}

export type NavOptions = {
  items: NavItem[],
  loggedIn: boolean
}

const DesktopContainer: FunctionComponent<NavOptions> = ({children, items}) => {
  let [fixed, setFixed] = React.useState(true)
  let [activeItem, setActiveItem] = React.useState(items[0])

  const hideFixedMenu = () => setFixed(false)
  const showFixedMenu = () => setFixed(true)
  const handleItemClick = (item: NavItem ) => setActiveItem(item)

  return (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={showFixedMenu}
        onBottomPassedReverse={hideFixedMenu}
      >
        <Segment
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : 'left'}
            pointing
            secondary
            size='large'
          >
            <Container>
            {items.map(item => (
              // @ts-ignore
              <Menu.Item as='a' active={activeItem.name == item.name } onClick={(_:any) => handleItemClick(item)}>
                {(item.icon)? <img src={item.icon}/>:''}
                {item.name}
              </Menu.Item>))
            }
              <Menu.Item position='right'>
                <Button as='a' inverted={!fixed}>
                <Icon name="sign in"/>
                  Log in
                </Button>
                <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                <Icon name="user outline"/>
                  Register
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>
      {children}
    </Responsive>
  )
}

type MobileContainerPropType = {
  sidebarOpened: boolean,
  activeItem: NavItem
}

class MobileContainer extends Component {
  private items: NavItem[]

  constructor(props: NavOptions) {
    super(props)
    this.items = props.items
  }

  state: MobileContainerPropType = {
    sidebarOpened: true,
    activeItem: this.items[0]
  }

  handleSidebarHide = () => this.setState({ sidebarOpened: false })
  handleToggle = () => this.setState({ sidebarOpened: true })
  handleItemClick = (e: any, name: NavItem ) => this.setState({ activeItem: name })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state
    let { activeItem } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          onHide={this.handleSidebarHide}
          vertical
          secondary
          visible={sidebarOpened}
        >
        {this.items.map(item => (
          <Menu.Item as='a' active={activeItem.name == item.name }>
            {item.name}
          </Menu.Item>))
        }
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item position='right'>
                  <Button as='a' inverted>
                    Log in
                  </Button>
                  <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Menu>
            </Container>
          </Segment>
          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}


export const ResponsiveContainer: FunctionComponent<NavOptions> = ({ children, items, loggedIn}) => {
  let data = {
    items,
    loggedIn
  }
  return (
  <div>
    {
      //@ts-ignore
      (window.mobilecheck())
        ? <MobileContainer {...data}>{children}</MobileContainer>
        : <DesktopContainer {...data}>{children}</DesktopContainer>
    }
  </div>
)}
