import React, { useEffect, useState } from 'react';
import { getBudgetAlert } from '../api';
import { useData } from '../context/DataContext';


const BudgetAlert = ({ token }) => {
  const [alert, setAlert] = useState(null);
  const { tick } = useData();

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const data = await getBudgetAlert(token);
        if (data.alert) {
          setAlert(data.message);
        } else {
          setAlert(null);
        }
      } catch (err) {
        console.error("Erreur alerte budget :", err);
      }
    };
    fetchAlert();
  }, [token, tick]);

  if (!alert) return null;

  return (
    <div className="budget-alert">
      ⚠️ {alert}
    </div>
  );
};

export default BudgetAlert;
