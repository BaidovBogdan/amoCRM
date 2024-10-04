import { atom } from 'jotai';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import Page from './components/page';
import './App.css';

export const accessTokenAtom = atom('');
export const refreshTokenAtom = atom('');

function App() {
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setRefreshToken] = useAtom(refreshTokenAtom);
  const [localAccessToken, setLocalAccessToken] = useState(
    localStorage.getItem('accessToken') || '',
  );
  const [, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getAccessToken() {
    const subdomain = 'qweqwe123q';
    const data = {
      client_id: '6da4adf5-6e31-4d75-99e2-4762ade0d186',
      grant_type: 'authorization_code',
      client_secret:
        '33niXeEyDDTeS6VhWc7HTEnryvEa3BAHk2TUyEvBB3jspkXhoIlu0Zrh5CwoVM4k',
      code: 'def50200fcd7e35f05257acf7851e56ee4a889bbcb4d508f238633efa2b95003c75214469553d7812cbbac54f021ff63a2a279410fdd2f78b368ed21b4946c399f019d410cfd66b1da50e77ff9e39539d8628c6c056e75a09cf2c1e0ad526076a11f90dfee9187765c85176e4e1d05a26da5ead64a0ca110d5a07df646b0f7f1c218aa6351251bfa6ee1e25b6933bedd55b0d9531be30db6fa540f8e7f140145ce71307cecec23d2f1d55491a20d964cd6567313ed4341feaf4a1a745feec4641b7700feecfdde9d128fc3b30991a9b8b5a2e41d6f21367a523898b855bcb4f79cec0f7044ada23bef4d26c4a6fa878e5f3b77cf639e30bff6a2171211dfcc98a74dcf8d8a68a6d25dd9c4eaa88845606f601ad41d163b676564bb86cf5774f1f94058d9506cbfe944f6f89a6b0b3c75ebf6ceddca6486d57b1660df13a0f4e83ede24952b62d11567507951b809b35d7d4efac49aa536df393a40a063f24878d0b5010976697b6d83b11f96182faadb0fe6d94eb5d63eaa88c1c4332e6842ee1ea83559b576b162bbbd8ea6a6d8f5f108d1a3a278402afa937a2ffe84d72afeeb4cd612a01575fa4db39694cb4178ab2b319df75433e2a9facdd28505e97e7315c610cfc2bc440b47faa60153c560850a3810db391f7409b86793ac27a8c4ded17c0fd4a6bb',
      redirect_uri: 'https://localhost.com',
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `https://cors-anywhere.herokuapp.com/https://${subdomain}.amocrm.ru/oauth2/access_token`,
        data,
      );
      console.log('Response Data:', response.data);
      if (response.data.access_token) {
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        setLocalAccessToken(response.data.access_token);
      } else {
        setError('Токен доступа отсутствует в ответе');
      }
    } catch (error) {
      setError('Ошибка при получении токена доступа');
      console.error('Error fetching access token:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!localAccessToken) {
      getAccessToken();
    }
  }, []);

  return (
    <div>
      {loading && <p>Загрузка токена...</p>}
      {localAccessToken && <Page />}
    </div>
  );
}

export default App;

