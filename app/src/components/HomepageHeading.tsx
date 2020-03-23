//@ts-ignore
import React, { FunctionComponent } from 'react'
import {
  Container,
  Header,
  Button,
  Icon
} from 'semantic-ui-react'

type propTypes = {
  mobile: boolean,
  content: string
}

export const HomepageHeading: FunctionComponent<propTypes>  = ({ mobile, content }: propTypes) => (
  <Container text>
    <Header
      as='h1'
      content={content}
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Button primary size='huge'>
      Get Started
      <Icon name='arrow right' />
    </Button>
  </Container>
)
