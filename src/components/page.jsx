import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Tag } from 'antd';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '../App';

const Page = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedDealId, setExpandedDealId] = useState(null);
  const [accessToken] = useAtom(accessTokenAtom);
  const subdomain = 'qweqwe123q';

  const fetchDeals = async () => {
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://${subdomain}.amocrm.ru/api/v4/leads`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const fetchedDeals = response.data._embedded.leads;
      setDeals(fetchedDeals);
    } catch (error) {
      console.error('Ошибка при получении сделок:', error);
    }
  };

  const fetchDealDetails = async (dealId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://${subdomain}.amocrm.ru/api/v4/leads/${dealId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const dealDetails = response.data;

      setDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.id === dealId ? { ...deal, ...dealDetails } : deal,
        ),
      );

      setExpandedDealId(expandedDealId === dealId ? null : dealId);
    } catch (error) {
      console.error('Ошибка при получении деталей сделки:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const getTaskColor = (closestTaskAt) => {
    const now = new Date();
    const taskDate = new Date(closestTaskAt * 1000);

    if (!closestTaskAt || taskDate < now) {
      return 'red';
    }

    if (taskDate.toDateString() === now.toDateString()) {
      return 'green';
    }

    return 'yellow';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Сделки</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="border rounded-lg p-4 cursor-pointer"
            onClick={() => {
              if (expandedDealId === deal.id) {
                setExpandedDealId(null);
              } else {
                fetchDealDetails(deal.id);
              }
            }}
          >
            {loading && expandedDealId === deal.id ? (
              <Spin size="large" />
            ) : (
              <>
                <h2 className="text-lg font-semibold">{deal.name}</h2>
                <p>ID: {deal.id}</p>
                <p>Цена: {deal.price}</p>
                <p>
                  Статус:
                  <Tag color="blue">{deal.status_id}</Tag>
                </p>
                {expandedDealId === deal.id && deal.closest_task_at && (
                  <div>
                    <p>
                      Дата задачи:{' '}
                      {new Date(deal.closest_task_at * 1000).toLocaleDateString(
                        'ru-RU',
                      )}
                    </p>
                    <div
                      className={`w-4 h-4 rounded-full`}
                      style={{
                        backgroundColor: getTaskColor(deal.closest_task_at),
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
