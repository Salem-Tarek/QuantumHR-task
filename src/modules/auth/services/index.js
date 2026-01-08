export const handleLogin = (form) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (form.email === 'q@quantum.io' && form.password === 'qTask123#') {
        resolve({
          success: true,
          data: {
            access: "fake-token",
            refresh: "fake-refresh",
            userData: {
              id: 1,
              name: "Salem Tarek",
              email: "q@quantum.io",
              city: "Cairo",
              country: "Egypt",
              phone: "01010101010",
              address: "Apartment 7, Building 85, El Nasr Road New Maadi",
              profilePicture: "https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI",
              jobTitle: "Frontend Developer",
              yearsOfExperience: 4,
              workingHoursFrom: new Date(),
              workingHoursTo: new Date(),
            }
          }
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};