"use client";

import { useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Icon
} from "@mui/material";
import { 
  Person as PersonIcon,
  Store as StoreIcon, 
  Business as VendorIcon 
} from "@mui/icons-material";

export default function Home() {
  const router = useRouter();

  const roles = [
    {
      title: "Driver",
      description: "Login with driver role",
      icon: <PersonIcon sx={{ fontSize: 60, color: "#1976d2" }} />,
      path: "/login",
      color: "#1976d2"
    },
    {
      title: "Store",
      description: "Login with store role",
      icon: <StoreIcon sx={{ fontSize: 60, color: "#388e3c" }} />,
      path: "/store-login",
      color: "#388e3c"
    },
    {
      title: "Admin/Vendor",
      description: "Login with admin/vendor role",
      icon: <VendorIcon sx={{ fontSize: 60, color: "#f57c00" }} />,
      path: "/vendor-login",
      color: "#f57c00"
    }
  ];

  const handleRoleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        py: 4 
      }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img 
              src="/logo.png" 
              alt="Scrap Plan Logo" 
              style={{ 
                width: "80px", 
                height: "80px", 
                marginRight: "16px" 
              }} 
            />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: "bold", 
                color: "#333",
                margin: 0
              }}
            >
              Scrap Plan
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontWeight: "medium", 
              color: "#555",
              mb: 2
            }}
          >
            Choose Your Role
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Please choose the role to access the system
          </Typography>
        </Box>

        {/* Role Cards */}
        <Grid container spacing={4} justifyContent="center">
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)"
                  }
                }}
                onClick={() => handleRoleSelect(role.path)}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: "center",
                  pt: 4
                }}>
                  <Box sx={{ mb: 3 }}>
                    {role.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: "bold",
                      color: role.color 
                    }}
                  >
                    {role.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {role.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: role.color,
                      "&:hover": {
                        backgroundColor: role.color,
                        opacity: 0.9
                      },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Login
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Scrap Plan. hoanyttv@gmail.com
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
