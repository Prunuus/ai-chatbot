'use client'
import { useState } from "react";
import {Box, Stack, TextField, Button, Avatar} from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';

export default function Home() {
  const [messages, setMessages] = useState([{
    role:'assistant',
    content: `*woof* Hi there! I am Reveille! I am a proud aggie of Texas A&M. Lets talk! 🐕`,
  }])

  const [message, setMessage] = useState('')

  const sendMessage = async () => {

    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content:message},
      {role: 'assistant', content: ''},
    ])
    const response = fetch('/api/chat',{
      method:'POST',
      headers: {
        'Content-Type':" application/json",
      },
        body: JSON.stringify([...messages, {role:'user', content: message}]),
      }).then( async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        } 
        const text = decoder.decode(value || new Int8Array(), {stream:true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length -1]
          let otherMessages = messages.slice(0, messages.length -1)
          return([
            ...otherMessages,
            {
              ...lastMessage,
              content:lastMessage.content + text,
            },
          ])
        })
        return reader.read().then(processText)
        })
    })
}

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      sendMessage()
    }
  }

  return (
    <Box
    width = "100vw"
    height = '100vh'
    display='flex'
    flexdDirection="center"
    alignItems="center"
    justifyContent="center">
      <Stack
      direction = 'column'
      width="70vw"
      height="90vh"
      border='1px solid black'
      p={2}
      spacing={3}
      backgroundColor="#3C0000"
      borderRadius={"25px"}>
        <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow="auto"
        maxHeight="100%"
        >
          {
            messages.map((message, index) => (
              <Box 
              key ={index} 
              display = 'flex' 
              justifyContent =
              {
                message.role === 'assistant' ? 'flex-start':'flex-end'
              }
              >

              { message.role === 'assistant' ? 
              <Stack direction={"row"} spacing={1}>
              <Avatar sx={{backgroundColor: '#8a2c2c', height:'50px',width:'50px'}} ><PetsIcon/></Avatar>
              <Box bgcolor={
                message.role === 'assistant' ? '#8a2c2c' : '#732F2f'
              }
              padding={"10px"}
              color="white"
              borderRadius={8}
              p={3}
              display={'flex'}
              justifyContent={"center"}
              alignItems={"center"}
              >
                {message.content}
              </Box>
              </Stack>
              :
              <Stack direction={"row"} spacing={1}>
              <Box bgcolor={
                message.role === 'assistant' ? '#8a2c2c' : '#732F2f'
              }
              color="white"
              borderRadius={16}
              p={3}
              display={'flex'}
              justifyContent={"center"}
              alignItems={"center"}
              >
                {message.content}
              </Box>
              <Avatar sx={{backgroundColor: '#8a2c2c', height:'50px', width:'50px'}} ><PersonIcon/></Avatar>
              </Stack>
              }

              </Box>
            ))}

        </Stack>
        <Stack direction ='row' spacing={2}>
          {message === '' ?
          <TextField
          sx ={{backgroundColor:'white', borderRadius:"5px"}}
          label = 'message'
          fullWidth
          autoComplete="off"
          value ={message}
          InputLabelProps={{
            shrink: false,
          }}
          onKeyDown={keyPress}
          onChange= {(e) => setMessage(e.target.value)}/>
          :
          <TextField
          sx ={{backgroundColor:'white', borderRadius:"5px"}}
          label = ''
          fullWidth
          autoComplete="off"
          value ={message}
          InputLabelProps={{
            shrink: false,
          }}
          onKeyDown={keyPress}
          onChange= {(e) => setMessage(e.target.value)}/>
        }
          <Button variant = 'contained' sx={{borderRadius:"5px"}} onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  )
}
