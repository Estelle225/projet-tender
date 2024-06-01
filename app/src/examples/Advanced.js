import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';

function Advanced() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/profiles')
      .then(response => response.json())
      .then(data => {
        setProfiles(data);
        setCurrentIndex(data.length - 1);
        currentIndexRef.current = data.length - 1;
      })
      .catch(error => console.error('Error fetching profiles:', error));
  }, []);

  const childRefs = useMemo(
    () => Array(profiles.length).fill(0).map((i) => React.createRef()),
    [profiles.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < profiles.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < profiles.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <img src='https://fr.tinderpressroom.com/download/Wordmark-R+white+RGB-new.png' className='logo' alt='Tinder Logo' />
      
      <div className='cardContainer'>
        {profiles.map((profile, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={profile.id}
            onSwipe={(dir) => swiped(dir, profile.firstname, index)}
            onCardLeftScreen={() => outOfFrame(profile.firstname, index)}
          >
            <div className='card'>
              <div
                className='cardImage'
                style={{
                  backgroundImage: `url(${profile.picture})`
                }}
              />
              <div className='cardDetails'>
                <h3>{profile.firstname} {profile.lastname}, {profile.age}</h3>
                <p>{profile.location.city}, {profile.location.state}, {profile.location.country}</p>
                <p>{profile.description}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className='buttons'>
        <button style={{ 
          backgroundImage: `url(https://cdn-icons-png.flaticon.com/512/59/59338.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          border: 'none',
          cursor: 'pointer' 
          }} onClick={() => swipe('left')}/>
        <button style={{ 
          backgroundImage: `url(https://cdn.icon-icons.com/icons2/933/PNG/512/undo-button_icon-icons.com_72497.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          border: 'none',
          cursor: 'pointer'
         }} onClick={() => goBack()}/>
        <button style={{
          backgroundImage: `url(https://purepng.com/public/uploads/large/heart-icon-jst.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          border: 'none',
          cursor: 'pointer'
        }} onClick={() => swipe('right')}/>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button 
        </h2>
      )}
    </div>
  );
}

export default Advanced;
