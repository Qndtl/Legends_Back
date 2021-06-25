import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export default axios.create({
  headers: {
    "X-Riot-Token": process.env.RIOT_KEY
  }
})