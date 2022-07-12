import { Avatar, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

function UserList() {
  return (
    <>
    <ListItem button   >
      <ListItemIcon>
        <Avatar 
          src=""
        />
      </ListItemIcon>
      <ListItemText primary="Jaydip patel">
         Jaydip patel
      </ListItemText> 
    </ListItem>
    <Divider />
    </>
  )
}

export default UserList