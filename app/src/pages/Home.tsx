//@ts-ignore
import React, { FunctionComponent } from 'react'
import { HomepageHeading } from '../components'

export const Home: FunctionComponent = (props?: any) => {
  let content: string = 'hey'
  return (
    <HomepageHeading mobile={false} content={content} />
  )
}
