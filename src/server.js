import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from './axios';
dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`🚀Server Running on http://localhost:${PORT}🚀`))

app.post('/summoner', async (req, res) => {
  try {
    //summoner name
    const { summoner } = req.body;
    const encodedSummoner = encodeURI(summoner);
    //summoner's id, accountId, puuid, name, profileIconId, level, revisionDate
    const { data: summonerInfos } = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedSummoner}`);

    res.status(200).json({ summonerInfos })
  } catch (error) {
    console.log(error.message);
    res.status(error.response.status).json({ msg: "Error occured." })
  }
})

app.post('/match', async (req, res) => {
  try {
    const { puuid, start } = req.body;
    const { data: matchIds } = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=10`);

    res.status(200).json({ matchIds })
  } catch (error) {
    console.log(error.message);
    res.status(error.response.status).json({ msg: "Error occured." })
  }
})

app.post('/matchresult', async (req, res) => {
  try {
    const { matchIds } = req.body;
    const gameResults = [];
    for (let i = 0; i < matchIds.length; i++) {
      const result = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchIds[i]}`);
      gameResults.push(result.data);
    }
    res.status(200).json({ gameResults })
  } catch (error) {
    console.log(error);
    res.status(error.response.status).json({ msg: "Error occured." })
  }
})

app.post('/league', async (req, res) => {
  try {
    const { summonerId } = req.body;
    const { data: leagueArray } = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`);
    const soloRankData = leagueArray.filter(league => league.queueType === 'RANKED_SOLO_5x5');
    const teamRankData = leagueArray.filter(league => league.queueType !== 'RANKED_SOLO_5x5');
    res.status(200).json({ soloRankData, teamRankData })
  } catch (error) {
    res.status(error.response.status).json({ msg: "Error occured." })
  }
})