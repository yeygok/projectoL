import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

/**
 * Componente del footer de la página.
 * Muestra información de la empresa, enlaces y redes sociales.
 * @returns {JSX.Element} Footer de la página
 */
export function FooterSection() {
  const enlacesRapidos = [
    { nombre: 'Inicio', href: '#home' },
    { nombre: 'Servicios', href: '#services-section' },
    { nombre: 'Planes', href: '#plans-section' },
    { nombre: 'Sobre Nosotros', href: '#about-section' },
    { nombre: 'Testimonios', href: '#testimonials-section' },
    { nombre: 'Contacto', href: '#contact-section' },
  ];

  const servicios = [
    'Limpieza Residencial',
    'Limpieza Comercial',
    'Limpieza Profunda',
    'Servicios Especiales',
    'Mantenimiento Regular',
    'Limpieza Post-Obra',
  ];

  const informacionContacto = [
    { icon: <PhoneIcon />, texto: '+56 9 1234 5678' },
    { icon: <EmailIcon />, texto: 'contacto@limpiezapro.cl' },
    { icon: <LocationOnIcon />, texto: 'Av. Providencia 123, Santiago' },
  ];

  const redesSociales = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 8,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Información de la empresa */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LimpiezaPro
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.7,
                color: 'grey.300',
              }}
            >
              Somos líderes en servicios de limpieza profesional, comprometidos con la excelencia,
              la sostenibilidad y la satisfacción total de nuestros clientes. Transformamos espacios
              con pasión y profesionalismo desde 2015.
            </Typography>

            {/* Redes sociales */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {redesSociales.map((red, index) => (
                <IconButton
                  key={index}
                  href={red.href}
                  aria-label={red.label}
                  sx={{
                    color: 'grey.400',
                    '&:hover': {
                      color: '#667eea',
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {red.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Enlaces rápidos */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'white',
              }}
            >
              Enlaces Rápidos
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {enlacesRapidos.map((enlace, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Link
                    href={enlace.href}
                    sx={{
                      color: 'grey.300',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#667eea',
                        textDecoration: 'none',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {enlace.nombre}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Servicios */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'white',
              }}
            >
              Nuestros Servicios
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {servicios.map((servicio, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'grey.300',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#667eea',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {servicio}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Información de contacto */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'white',
              }}
            >
              Contáctanos
            </Typography>
            <Box sx={{ mb: 3 }}>
              {informacionContacto.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      color: '#667eea',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'grey.300',
                    }}
                  >
                    {info.texto}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Horario de atención */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: 'white',
                }}
              >
                Horario de Atención:
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.300', mb: 0.5 }}>
                Lun - Vie: 8:00 - 18:00
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.300' }}>
                Sáb: 9:00 - 14:00
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, bgcolor: 'grey.700' }} />

        {/* Sección inferior */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.400',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © 2024 LimpiezaPro. Todos los derechos reservados.
          </Typography>

          <Box sx={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}>
            <Link
              href="#"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#667eea',
                  textDecoration: 'none',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Política de Privacidad
            </Link>
            <Link
              href="#"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#667eea',
                  textDecoration: 'none',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Términos de Servicio
            </Link>
            <Link
              href="#"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#667eea',
                  textDecoration: 'none',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Política de Cookies
            </Link>
          </Box>
        </Box>

        {/* Badge de certificaciones o reconocimientos */}
        <Box sx={{
          mt: 4,
          pt: 3,
          borderTop: '1px solid rgba(102, 126, 234, 0.1)',
          textAlign: 'center',
        }}>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.500',
              fontSize: '0.8rem',
            }}
          >
            Certificado ISO 9001:2015 • Empresa B Certificada • Miembro de la Cámara de Comercio
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}