import { useEffect, useState } from "react";
const Home = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http:/localhost:5000/profile", {
                    credentials: "include"
                })
                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await res.json()
                setUsername(data.username);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
            fetchUser();
    },[])
  return (
    <div>
      {`You successfully reached home page ${username}`}
    </div>
  );
}

export default Home