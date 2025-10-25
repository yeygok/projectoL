import React, { memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fade,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  LocalShipping as LocalShippingIcon,
  SupportAgent as SupportIcon,
  Nature as EcoIcon,
  Schedule as ScheduleIcon,
  Shield as SecurityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useIntersectionObserver } from '../../hooks';

/**
 * Datos de las ventajas - Separados del componente para mejor mantenibilidad
 */
const VENTAJAS_DATA = [
  {
    id: 'certificados',
    icon: VerifiedIcon,
    titulo: 'Profesionales Certificados',
    descripcion: 'Nuestro equipo está formado por profesionales capacitados y certificados en técnicas de limpieza avanzadas.',
    color: '#667eea',
    popular: true,
  },
  {
    id: 'domicilio',
    icon: LocalShippingIcon,
    titulo: 'Servicio a Domicilio',
    descripcion: 'Llevamos nuestros servicios directamente a tu hogar o negocio, sin que tengas que moverte.',
    color: '#764ba2',
    popular: false,
  },
  {
    id: 'atencion-24-7',
    icon: SupportIcon,
    titulo: 'Atención 24/7',
    descripcion: 'Estamos disponibles para atender tus necesidades en cualquier momento del día.',
    color: '#f093fb',
    popular: true,
  },
  {
    id: 'ecologico',
    icon: EcoIcon,
    titulo: 'Productos Ecológicos',
    descripcion: 'Utilizamos productos biodegradables y respetuosos con el medio ambiente.',
    color: '#4facfe',
    popular: false,
  },
  {
    id: 'flexibilidad',
    icon: ScheduleIcon,
    titulo: 'Flexibilidad Horaria',
    descripcion: 'Adaptamos nuestros horarios a tu disponibilidad para mayor comodidad.',
    color: '#43e97b',
    popular: false,
  },
  {
    id: 'seguro',
    icon: SecurityIcon,
    titulo: 'Seguro de Responsabilidad',
    descripcion: 'Contamos con seguro que cubre cualquier eventualidad durante nuestros servicios.',
    color: '#38f9d7',
    popular: false,
  },
];

/**
 * Datos de promesas de calidad
 */
const PROMESAS_DATA = [
  {
    id: 'satisfaccion',
    icon: VerifiedIcon,
    titulo: 'Garantía de Satisfacción',
    descripcion: '100% satisfacción garantizada',
    color: 'success',
  },
  {
    id: 'puntualidad',
    icon: ScheduleIcon,
    titulo: 'Puntualidad',
    descripcion: 'Siempre a tiempo, sin excusas',
    color: 'warning',
  },
  {
    id: 'sostenibilidad',
    icon: EcoIcon,
    titulo: 'Sostenibilidad',
    descripcion: 'Comprometidos con el planeta',
    color: 'info',
  },
];

/**
 * Estilos reutilizables
 */
const styles = {
  section: {
    bgcolor: 'grey.50',
    py: { xs: 8, md: 12 },
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: (position) => ({
    content: '""',
    position: 'absolute',
    [position]: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: \`linear-gradient(to \${position === 'top' ? 'bottom' : 'top'}, rgba(255,255,255,0.9), transparent)\`,
  }),
  floatingElement: (size, position, animationDuration) => ({
    position: 'absolute',
    ...position,
    width: \`\${size}px\`,
    height: \`\${size}px\`,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    animation: \`float \${animationDuration}s ease-in-out infinite\`,
  }),
};

/**
 * Componente de tarjeta de ventaja - Memoizado para mejor performance
 */
const VentajaCard = memo(({ ventaja, index }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const IconComponent = ventaja.icon;

  return (
    <Grid item xs={12} sm={6} lg={4} ref={ref}>
      <Fade in={isVisible} timeout={500 + index * 100}>
        <Card
          sx={{
            height: '100%',
            borderRadius: 4,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: ventaja.popular ? \`2px solid \${ventaja.color}40\` : '1px solid rgba(102, 126, 234, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: \`linear-gradient(90deg, \${ventaja.color}, \${ventaja.color}dd)\`,
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-12px) scale(1.02)',
              boxShadow: \`0 25px 50px rgba(0,0,0,0.15), 0 0 30px \${ventaja.color}30\`,
              borderColor: ventaja.color,
              '&::before': {
                transform: 'scaleX(1)',
              },
              '& .advantage-icon': {
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: \`0 10px 30px \${ventaja.color}40\`,
              },
              '& .advantage-title': {
                color: ventaja.color,
              },
            },
          }}
        >
          {ventaja.popular && (
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                zIndex: 1,
              }}
            >
              <Chip
                label="Destacado"
                size="small"
                sx={{
                  bgcolor: ventaja.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  transform: 'rotate(15deg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              />
            </Box>
          )}

          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Avatar
              className="advantage-icon"
              sx={{
                width: { xs: 70, md: 80 },
                height: { xs: 70, md: 80 },
                mx: 'auto',
                mb: 3,
                bgcolor: \`\${ventaja.color}15\`,
                color: ventaja.color,
                fontSize: { xs: 35, md: 40 },
                border: \`2px solid \${ventaja.color}30\`,
                transition: 'all 0.3s ease',
                boxShadow: \`0 4px 15px \${ventaja.color}20\`,
              }}
            >
              <IconComponent />
            </Avatar>
            <Typography
              className="advantage-title"
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                transition: 'color 0.3s ease',
                lineHeight: 1.3,
              }}
            >
              {ventaja.titulo}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                fontSize: { xs: '0.95rem', md: '1rem' },
                px: 1,
              }}
            >
              {ventaja.descripcion}
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Grid>
  );
});

VentajaCard.displayName = 'VentajaCard';

/**
 * Componente de promesa de calidad - Memoizado
 */
const PromesaCard = memo(({ promesa }) => {
  const IconComponent = promesa.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        bgcolor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        textAlign: 'left',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(102, 126, 234, 0.15)',
          borderColor: 'primary.main',
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: \`\${promesa.color}.light\`,
          color: \`\${promesa.color}.main\`,
          width: { xs: 45, md: 50 },
          height: { xs: 45, md: 50 },
          flexShrink: 0,
        }}
      >
        <IconComponent />
      </Avatar>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: '1rem', md: '1.1rem' },
          }}
        >
          {promesa.titulo}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.85rem', md: '0.9rem' },
            lineHeight: 1.4,
          }}
        >
          {promesa.descripcion}
        </Typography>
      </Box>
    </Box>
  );
});

PromesaCard.displayName = 'PromesaCard';

/**
 * Componente principal de la sección "¿Por qué elegirnos?"
 * Versión refactorizada con mejores prácticas y optimizaciones
 */
export const WhyChooseUsSection = memo(() => {
  const [sectionRef, isSectionVisible] = useIntersectionObserver({
    threshold: 0.05,
    freezeOnceVisible: true,
  });

  return (
    <Box
      id="why-choose-us-section"
      ref={sectionRef}
      sx={{
        ...styles.section,
        '&::before': styles.gradientOverlay('top'),
        '&::after': styles.gradientOverlay('bottom'),
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box sx={styles.floatingElement(100, { top: '10%', left: '5%' }, 6)} />
      <Box
        sx={{
          ...styles.floatingElement(80, { top: '60%', right: '8%' }, 8),
          background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(79, 172, 254, 0.1))',
          animationDirection: 'reverse',
        }}
      />

      <Container maxWidth="lg">
        {/* Encabezado de la sección */}
        <Fade in={isSectionVisible} timeout={600}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Chip
              label="¿Por Qué Elegirnos?"
              icon={<StarIcon />}
              sx={{
                mb: 3,
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                py: 1,
                borderRadius: 50,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              ¿Por Qué Elegirnos?
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                px: 2,
              }}
            >
              Descubre las razones por las que miles de clientes confían en nosotros
              para mantener sus espacios impecables
            </Typography>
          </Box>
        </Fade>

        {/* Grid de ventajas */}
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {VENTAJAS_DATA.map((ventaja, index) => (
            <VentajaCard key={ventaja.id} ventaja={ventaja} index={index} />
          ))}
        </Grid>

        {/* Sección de promesas de calidad */}
        <Fade in={isSectionVisible} timeout={1000}>
          <Box
            sx={{
              mt: { xs: 6, md: 10 },
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: 'text.primary',
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              Nuestra Promesa de Calidad
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: { xs: 2, md: 3 },
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {PROMESAS_DATA.slice(0, 2).map((promesa) => (
                <PromesaCard key={promesa.id} promesa={promesa} />
              ))}
              <Box
                sx={{
                  gridColumn: { xs: '1 / -1', md: '1 / -1' },
                }}
              >
                <PromesaCard promesa={PROMESAS_DATA[2]} />
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Animación CSS */}
      <style>{\`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      \`}</style>
    </Box>
  );
});

WhyChooseUsSection.displayName = 'WhyChooseUsSection';

export default WhyChooseUsSection;
