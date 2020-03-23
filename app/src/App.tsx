import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ResponsiveContainer, defaultNavOptions } from './components';
import 'semantic-ui-less/semantic.less'

function App() {
  console.log({...defaultNavOptions})
  return (
    <ResponsiveContainer {...defaultNavOptions}/>
  );
}

export default App;
