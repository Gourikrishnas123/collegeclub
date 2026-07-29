import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getClubsApi } from '../api/clubs';

const ClubContext = createContext(null);

export const ClubProvider = ({ children }) => {
  const { user, isSuperAdmin, ownClubId } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [currentClubId, setCurrentClubId] = useState(null);
  const [currentClub, setCurrentClub] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchClubs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getClubsApi();
      setClubs(data || []);

      if (data && data.length > 0) {
        if (isSuperAdmin) {
          if (!currentClubId || !data.find(c => c._id?.toString() === currentClubId?.toString())) {
            setCurrentClubId(data[0]._id.toString());
            setCurrentClub(data[0]);
          } else {
            setCurrentClub(data.find(c => c._id?.toString() === currentClubId?.toString()));
          }
        } else {
          // Member / club_admin locked to own club
          const myClub = data.find(c => c._id?.toString() === ownClubId?.toString()) || data[0];
          if (myClub) {
            setCurrentClubId(myClub._id.toString());
            setCurrentClub(myClub);
          }
        }
      }
    } catch (err) {
      console.error('Error in ClubProvider fetching clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [user, ownClubId]);

  const selectClub = (clubId) => {
    if (!clubId) return;
    const club = clubs.find(c => c._id?.toString() === clubId.toString());
    if (club) {
      setCurrentClubId(club._id.toString());
      setCurrentClub(club);
    }
  };

  const refreshClub = async (clubId) => {
    try {
      const data = await getClubsApi();
      setClubs(data || []);
      const targetId = clubId || currentClubId;
      const match = data.find(c => c._id?.toString() === targetId?.toString());
      if (match) {
        setCurrentClub(match);
      }
    } catch (err) {
      console.error('Error refreshing club context:', err);
    }
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      currentClubId,
      currentClub,
      selectClub,
      refreshClub,
      loading
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
