// Simulate API calls with dummy data (replace with real API calls later)
export const signup = async (data) => {
    // Simulate successful signup
    return { data: { message: "Signup successful!" } };
  };
  
  export const getResults = async () => {
    const results = [
      { id: 1, title: "Result 1", image: "/images/dummy-image.png" }, // Replace with actual image path
      { id: 2, title: "Result 2", image: "/images/dummy-image.png" },
    ];
    return { data: results };
  };
  
  export const editResult = async (id, data) => {
    // Simulate successful edit
    return { data: { message: `Result ${id} edited!` } };
  };
  
  export const deleteResult = async (id) => {
    // Simulate successful deletion
    return { data: { message: `Result ${id} deleted!` } };
  };
  