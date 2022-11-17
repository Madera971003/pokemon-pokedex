import React from 'react';
import { Grid, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import './styles.css';

export const Footer = () => {
  return (
    <>
      <footer className='footer_container'>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
          >
            <h4>Made by Abisai Antonio Madera</h4>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            sx={{ display: 'flex' }}
          >
            <IconButton
              href='https://github.com/Madera971003/pokemon-pokedex'
              target='_blank'
            >
              <GitHubIcon
                fontSize='inherit'
                sx={{ color: 'gray' }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </footer>
    </>
  );
};
