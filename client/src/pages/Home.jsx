import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setUsername(data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };

    fetchUser();
  }, []);

  return <div>You successfully reached home page {username}</div>;
};

export default Home;
