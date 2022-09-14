const data = {
  products: [
    {
      _id: 1,
      name: 'Tortilla Española',
      slug: 'tortilla-espanola',
      category: 'Entrantes',
      image: '/images/p1.jpg',
      price: 6,
      isAvailable: true,
      description:
        'Deliciosa tortilla española hecha en el momento. Atención: no lleva cebolla.',
      alergenos: {
        isGluten: true,
        isMarisco: false,
        isHuevos: true,
        isPescado: false,
        isCacahuetes: false,
        isSoja: false,
        isLacteos: true,
        isFrutosSecos: false,
        isApio: false,
        isMostaza: false,
        isGranosSesamo: false,
        isSulfitos: false,
        isAltramuces: false,
        isMoluscos: false,
        isVegetariano: true,
        isVegano: false,
      },
    },
    {
      _id: 2,
      name: 'Surtido de Ibéricos',
      slug: 'surtido-ibericos',
      category: 'Entrantes',
      image: '/images/p2.jpg',
      price: 9,
      isAvailable: true,
      description: 'Queso semicurado con surtido de ibéricos de jamón y lomo.',
      alergenos: {
        isGluten: true,
        isMarisco: true,
        isHuevos: true,
        isPescado: true,
        isCacahuetes: true,
        isSoja: true,
        isLacteos: true,
        isFrutosSecos: true,
        isApio: true,
        isMostaza: true,
        isGranosSesamo: true,
        isSulfitos: true,
        isAltramuces: true,
        isMoluscos: true,
        isVegetariano: false,
        isVegano: false,
      },
    },
    {
      _id: 3,
      name: 'Sopa Castellana',
      slug: 'sopa-castellana',
      category: 'Puchero',
      image: '/images/p3.jpg',
      price: 8.5,
      isAvailable: false,
      description: 'Sopa castellana, ideal para días fríos.',
      alergenos: {
        isGluten: true,
        isMarisco: true,
        isHuevos: true,
        isPescado: true,
        isCacahuetes: false,
        isSoja: false,
        isLacteos: false,
        isFrutosSecos: false,
        isApio: false,
        isMostaza: false,
        isGranosSesamo: false,
        isSulfitos: false,
        isAltramuces: false,
        isMoluscos: true,
        isVegetariano: false,
        isVegano: false,
      },
    },
    {
      _id: 4,
      name: 'Ensalada César',
      slug: 'ensalada-cesar',
      category: 'Ensaladas',
      image: '/images/p4.jpg',
      price: 6,
      isAvailable: true,
      description: 'Ensalada césar para 2 personas.',
      alergenos: {
        isGluten: true,
        isMarisco: true,
        isHuevos: true,
        isPescado: true,
        isCacahuetes: false,
        isSoja: false,
        isLacteos: false,
        isFrutosSecos: false,
        isApio: false,
        isMostaza: false,
        isGranosSesamo: false,
        isSulfitos: false,
        isAltramuces: false,
        isMoluscos: true,
        isVegetariano: false,
        isVegano: false,
      },
    },
    {
      _id: 5,
      name: 'Entrecot de Ternera',
      slug: 'entrecot-ternera',
      category: 'Carnes',
      image: '/images/p5.jpg',
      price: 18,
      isAvailable: true,
      description: 'Delicioso entrecot de ternera cocinado a su gusto.',
      alergenos: {
        isGluten: true,
        isMarisco: true,
        isHuevos: true,
        isPescado: true,
        isCacahuetes: false,
        isSoja: false,
        isLacteos: false,
        isFrutosSecos: false,
        isApio: false,
        isMostaza: false,
        isGranosSesamo: false,
        isSulfitos: false,
        isAltramuces: false,
        isMoluscos: true,
        isVegetariano: false,
        isVegano: false,
      },
    },
    {
      _id: 6,
      name: 'Pluma Ibérica',
      slug: 'pluma-iberica',
      category: 'Carnes',
      image: '/images/p6.jpg',
      price: 16,
      isAvailable: true,
      description: 'Deliciosa pluma ibérica con guarnición de patatas fritas.',
      alergenos: {
        isGluten: true,
        isMarisco: true,
        isHuevos: true,
        isPescado: true,
        isCacahuetes: false,
        isSoja: false,
        isLacteos: false,
        isFrutosSecos: false,
        isApio: false,
        isMostaza: false,
        isGranosSesamo: false,
        isSulfitos: false,
        isAltramuces: false,
        isMoluscos: true,
        isVegetariano: false,
        isVegano: false,
      },
    },
  ],
};

export default data;
