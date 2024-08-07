import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router

const OrderPlacedSuccessfully = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to the homepage after 5 seconds
      navigate('/');
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts or when redirecting happens
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center mt-[20rem]">
      <div className="block items-center">
        <h2 className="text-orange-500 font-extrabold text-4xl">Your order has been placed successfully!</h2>
        <p className="text-pink-500 font-bold text-3xl text-center">We will deliver your order soon.</p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default OrderPlacedSuccessfully;
