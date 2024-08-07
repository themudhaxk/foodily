import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
    const [hoverValue, setHoverValue] = useState(0);

    return (
        <div>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;

                return (
                    <FaStar
                        key={index}
                        size={25}
                        color={(starValue <= (hoverValue || rating)) ? '#FFD700' : '#C0C0C0'}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoverValue(starValue)}
                        onMouseLeave={() => setHoverValue(0)}
                        onClick={() => onRatingChange(starValue)}
                        className='inline-flex'
                    />
                );
            })}
        </div>
    );
};

export default StarRating;