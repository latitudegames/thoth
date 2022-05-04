import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import Tables from '../Admin/Tables'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const drawerWidth = 240

const Container = styled(Grid)({
  marginBottom: '1.5rem',
})

const ButtonCustom = styled(Button)({
  background: '#424242',
  color: '#fff',
  border: '1px solid #636363',
  '&:hover': {
    background: '#424242',
  },
})

const OutlineButton = styled(Button)({
  color: '#fff',
  border: '2px solid #636363',
  '&:hover': {
    border: '1px solid #636363',
  },
})

const AdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Thoth
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(70, 70, 70, 0.95)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Config', 'Client Settings', 'scope'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h3" gutterBottom component="div">
          Client Settings
        </Typography>
        <Container container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h6" gutterBottom component="div">
              These are all the client settings you have created
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <ButtonCustom variant="contained" size="medium" fullWidth>
              Add Setting
            </ButtonCustom>
          </Grid>
        </Container>

        <Container container spacing={2}>
          <Grid item xs={11}>
            <FormControl sx={{ width: '100%' }}>
              <OutlinedInput placeholder="Search" />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <OutlineButton variant="outlined" size="medium" fullWidth>
              Filter
            </OutlineButton>
          </Grid>
        </Container>

        <Tables />
      </Box>
    </Box>
  )
}

export default AdminDashboard
