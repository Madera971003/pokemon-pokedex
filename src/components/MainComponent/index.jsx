import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Spinner } from './Spinner';
import axios from 'axios';
import './styles.css';

export const MainComponent = () => {
  const [pokemon, setPokemon] = useState();
  const [abilities, setAbilities] = useState([]);
  const [pokemonNameOrId, setPokemonNameOrId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [flagRetry, setFlagRetry] = useState(false);

  const getPokemon = async (nameOrId) => {
    setLoading(true);
    setPokemon();
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`
      );
      setPokemon(data);
      setErrorMessage('');
      setLoading(false);
      setErrorMessage('');
      setPokemonNameOrId('');
      setFlagRetry(false);
    } catch (error) {
      if (!flagRetry || error.code === 'ERR_NETWORK') {
        setFlagRetry(true);
      }
      setStatus(error.code);
      setPokemon();
      if (error.code === 'ERR_NETWORK') {
        setErrorMessage('Sorry, Network is failing');
      } else if (error.code === 'ERR_BAD_REQUEST') {
        setErrorMessage('Sorry we could not find that pokemon 😐😥');
        if (flagRetry) {
          setPokemonNameOrId('');
          setFlagRetry(false);
        }
      }
      setLoading(false);
    }
  };

  const getAbilities = async ({ name, url }) => {
    const { data } = await axios.get(url);
    const { effect } = data.effect_entries.find(
      (item) => item.language.name === 'en'
    );
    setAbilities((prev) => [...prev, { effect, name }]);
  };

  const handleChange = (event) => {
    setPokemonNameOrId(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && pokemonNameOrId !== '') {
      getPokemon(pokemonNameOrId);
    }
  };
  const handleClick = () => {
    getPokemon(pokemonNameOrId);
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setStatus('');
      }, 3000);
    }
  }, [errorMessage, status]);

  useEffect(() => {
    if (pokemon) {
      setAbilities([]);
      pokemon.abilities.forEach(({ ability }) => {
        getAbilities(ability);
      });
    }
  }, [pokemon]);

  return (
    <div className='main_container'>
      <div className='search_and_button'>
        <div className='search_container'>
          <InputBase
            placeholder='Search a Pokemon'
            value={pokemonNameOrId}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <IconButton
            aria-label='delete'
            size='large'
            onClick={handleClick}
          >
            <SearchIcon fontSize='inherit' />
          </IconButton>
        </div>
        {flagRetry && (
          <Button
            variant='outlined'
            color='error'
            onClick={() => {
              handleClick();
            }}
          >
            Retry
          </Button>
        )}
      </div>
      <small className='text_help'>
        Write a pokemon name or an id from 1 to 905
      </small>
      {status === 'ERR_BAD_REQUEST' && (
        <Paper>
          <Alert
            severity='error'
            className='error_bar'
          >
            {errorMessage}
          </Alert>
        </Paper>
      )}
      {status === 'ERR_NETWORK' && (
        <Alert
          severity='warning'
          className='error_bar'
        >
          {errorMessage}
        </Alert>
      )}
      {loading && <Spinner />}
      {pokemon && (
        <Grid
          container
          sx={{ marginTop: '20px' }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={{ padding: '10px' }}
          >
            <Paper
              elevation={2}
              sx={{ padding: '10px' }}
            >
              {pokemon && (
                <div className='info-container'>
                  <div className='number'>
                    <small className='text-pokemon-info'>#{pokemon.id}</small>
                  </div>
                  <img
                    src={
                      pokemon.sprites.other.dream_world.front_default ??
                      './no_image.png'
                    }
                    alt={pokemon.name}
                  />
                  <div className='detail-wrapper'>
                    <h3 className='text-pokemon-info'>{pokemon.name}</h3>
                    <small className='text-pokemon-info'>
                      Type: {pokemon.types[0].type.name}
                    </small>
                  </div>
                </div>
              )}
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            sx={{ padding: '10px' }}
          >
            {abilities && (
              <Paper
                elevation={2}
                sx={{ padding: '10px' }}
              >
                {abilities.map((ability) => (
                  <Accordion key={ability.name}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {ability.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{ability.effect}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};
