import type { Dictionary } from "./types";

export const pt: Dictionary = {
  meta: {
    siteTitle: "Kite Suites — Hospedagem e Gastronomia em Praia Seca",
    siteDescription:
      "Pousada e restaurante de frente para a lagoa de Araruama, em Praia Seca. Suítes com café da manhã, aulas de kitesurf, serviço de praia e passeios.",
  },

  nav: {
    home: "Home",
    suites: "Acomodações",
    services: "Serviços",
    restaurant: "Restaurante",
    contact: "Contato",
    bookCta: "Reserve aqui",
    bookShort: "Reservar",
    whatsappCta: "WhatsApp",
    callCta: "Ligar",
    skipToContent: "Saltar para o conteúdo",
  },

  hero: {
    eyebrow: "Praia Seca · Araruama · RJ",
    headline: "À espera de novos ventos",
    subheadline: "Tempo para você",
    body: "Desconecte-se da correria do dia a dia. Nossas acomodações são uma combinação perfeita de natureza e sofisticação. Nada mais prazeroso do que acordar de frente para a lagoa e praticar seu esporte favorito. Venha conhecer o Kite Suites, você merece.",
    primaryCta: "Conheça as acomodações",
    secondaryCta: "Reserve pelo WhatsApp",
    badges: [
      "Frente para a lagoa",
      "Café da manhã incluso",
      "Piscina",
      "Aulas de kitesurf",
    ],
  },

  highlights: {
    title: "Você merece...",
    intro:
      "Hospedagem, gastronomia e o vento de Praia Seca no mesmo lugar — tudo a poucos passos da lagoa de Araruama.",
    items: [
      {
        title: "Gastronomia",
        description:
          "Café da manhã, almoço ou um açaí no nosso restaurante de frente para a lagoa.",
        icon: "utensils",
      },
      {
        title: "Aulas de kitesurf",
        description:
          "Instrutores certificados para a sua primeira aula ou para evoluir no esporte.",
        icon: "kite",
      },
      {
        title: "Serviço de praia",
        description:
          "Cadeira, guarda-sol e atendimento para aproveitar o dia na lagoa ou na praia.",
        icon: "umbrella",
      },
      {
        title: "Passeios",
        description:
          "Bugre, jetski e barco em Praia Seca e Arraial do Cabo com nossos parceiros.",
        icon: "compass",
      },
    ],
  },

  wind: {
    title: "Vento em Praia Seca",
    intro:
      "Velocidade, rajadas e direção do vento para os próximos 3 dias na lagoa de Araruama. Previsão Windguru para o spot Araruama - Praia Seca.",
    note: "Velocidade e rajadas em nós (kt) · direção pela seta · atualizado pelo Windguru.",
    fallback:
      "Não foi possível carregar a previsão agora. Consulte o spot direto no Windguru.",
    spotCta: "Ver no Windguru",
  },

  gift: {
    eyebrow: "Presente de boas-vindas",
    title: "Ganhe um presente na sua primeira estadia",
    subtitle:
      "Cadastre-se no Clube Kite Suites e receba na hora o seu código de presente. E no seu aniversário tem mimo esperando por você.",
    benefits: [
      "Código de presente na hora, sem espera",
      "Mimo especial no mês do seu aniversário",
      "Ofertas e novidades antes de todo mundo",
    ],
    form: {
      name: "Nome completo",
      namePlaceholder: "Seu nome",
      phone: "Celular",
      phonePlaceholder: "(22) 99999-9999",
      email: "E-mail",
      emailPlaceholder: "voce@email.com",
      birthDate: "Data de nascimento",
      birthDateHint: "Para enviarmos o seu mimo de aniversário. Cadastro para maiores de 18 anos.",
      consent: "Aceito receber ofertas e novidades do Kite Suites e li a",
      consentLink: "política de privacidade",
      submit: "Quero meu presente",
      submitting: "Enviando...",
      errorGeneric:
        "Não foi possível concluir agora. Tente novamente ou fale pelo WhatsApp.",
      errorValidation: "Verifique os campos destacados.",
      errorAge: "O cadastro é permitido apenas para maiores de 18 anos.",
    },
    success: {
      title: "Presente liberado!",
      body: "Guarde o seu código e apresente na chegada ou na hora da reserva.",
      returningBody:
        "Você já faz parte do clube — este é o seu código de sempre.",
      codeLabel: "Seu código",
      copied: "Copiado!",
      whatsappCta: "Reservar com meu código",
      note: "Válido para uma utilização, não cumulativo com outras promoções.",
    },
    modal: {
      title: "Antes de ir, leve um presente",
      dismiss: "Agora não",
      close: "Fechar",
    },
  },

  suitesTeaser: {
    title: "Acomodações",
    intro:
      "Duas suítes com vista para a lagoa e um hostel com beliches — todos com café da manhã, ar-condicionado e WiFi.",
    cta: "Ver todas as acomodações",
  },

  location: {
    title: "Onde estamos",
    intro:
      "Na Avenida Praia dos Nobres, em São Tomé, Praia Seca — um dos melhores spots de kitesurf da Região dos Lagos.",
    addressLabel: "Endereço",
    hoursLabel: "Atendimento",
    directionsCta: "Como chegar",
    mapTitle: "Mapa com a localização do Kite Suites em Praia Seca",
  },

  finalCta: {
    headline: "Desconecte-se. Venha para a Kite Suites.",
    subheadline:
      "Fale com a gente pelo WhatsApp e garanta sua data — respondemos todos os dias, das 8h às 18h.",
    primaryCta: "Reservar pelo WhatsApp",
    secondaryCta: "Enviar mensagem",
  },

  suitesPage: {
    pageTitle: "Acomodações",
    pageDescription:
      "Suítes Arubinha e Coroinha com vista para a lagoa e o Hostel Downwind. Café da manhã, ar-condicionado, WiFi e piscina.",
    title: "Acomodações",
    intro:
      "Todos os quartos incluem café da manhã servido no restaurante, de frente para a lagoa.",
    bookCta: "Reservar agora",
    detailsLabel: "Detalhes",
    capacityLabel: "Capacidade",
    items: [
      {
        slug: "arubinha",
        name: "Suíte Arubinha",
        description:
          "Quarto aconchegante com 17 m², com vista maravilhosa para a lagoa. Todo o conforto que você precisa.",
        beds: "1 cama queen ou 2 de solteiro, mais 1 de solteiro.",
        amenities: [
          { label: "Café da manhã", icon: "coffee" },
          { label: "Frigobar", icon: "fridge" },
          { label: "Ar-condicionado", icon: "wind" },
          { label: "TV", icon: "tv" },
          { label: "WiFi", icon: "wifi" },
        ],
        capacity: "Acomoda até 3 pessoas.",
        image: "/images/room-1.jpg",
        imageAlt:
          "Suíte Arubinha com cama de casal e varanda com vista para a lagoa",
        gallery: [
          { src: "/images/room-4.jpg", alt: "Banheiro da suíte com bancada de madeira maciça" },
          { src: "/images/room-3.jpg", alt: "Frigobar, cafeteira e espelho da suíte" },
        ],
      },
      {
        slug: "coroinha",
        name: "Suíte Coroinha",
        description:
          "Quarto aconchegante de 17 m², com vista maravilhosa para a lagoa. Todo o conforto que você precisa.",
        beds: "1 cama queen ou 2 de solteiro, mais 1 de solteiro.",
        amenities: [
          { label: "Café da manhã", icon: "coffee" },
          { label: "Frigobar", icon: "fridge" },
          { label: "Ar-condicionado", icon: "wind" },
          { label: "TV", icon: "tv" },
          { label: "WiFi", icon: "wifi" },
        ],
        capacity: "Acomoda até 3 pessoas.",
        image: "/images/room-7.jpg",
        imageAlt: "Suíte Coroinha com cama queen e cabeceira de madeira",
        gallery: [
          { src: "/images/room-2.jpg", alt: "Sofá-cama e TV da suíte Coroinha" },
          { src: "/images/room-5.jpg", alt: "Banheiro com box de vidro e bancada de madeira" },
        ],
      },
      {
        slug: "downwind",
        name: "Hostel Downwind",
        description:
          "Dois beliches com armários. Localizado no térreo, próximo aos vestiários masculino e feminino.",
        beds: "2 beliches (4 camas).",
        amenities: [
          { label: "Café da manhã", icon: "coffee" },
          { label: "Ar-condicionado", icon: "wind" },
          { label: "WiFi", icon: "wifi" },
          { label: "Armário com chave", icon: "lock" },
        ],
        capacity: "Acomoda até 4 pessoas.",
        image: "/images/hostel-1.jpg",
        imageAlt: "Quarto do Hostel Downwind com dois beliches e armário",
        gallery: [
          { src: "/images/hostel-2.jpg", alt: "Saída do hostel para o jardim e a piscina" },
        ],
      },
    ],
  },

  servicesPage: {
    pageTitle: "Serviços",
    pageDescription:
      "Gastronomia de frente para a lagoa, aulas de kitesurf com instrutores certificados, serviço de praia e passeios em Praia Seca e Arraial do Cabo.",
    title: "Serviços",
    intro: "Saia da rotina. Escolha a Kite Suites.",
    items: [
      {
        slug: "gastronomia",
        title: "Gastronomia",
        description:
          "Venha tomar um café da manhã, almoçar ou tomar um açaí no nosso restaurante em frente à lagoa.",
        icon: "utensils",
        image: "/images/svc-1.jpg",
        imageAlt: "Mesa de café da manhã com frutas, sucos e pães",
        cta: "Conheça o restaurante",
      },
      {
        slug: "kitesurf",
        title: "Aulas de kitesurf",
        description:
          "Agende sua aula com nossos instrutores certificados e venha fazer parte desse mundo incrível do kitesurf.",
        icon: "kite",
        image: "/images/svc-2.jpg",
        imageAlt: "Instrutor acompanhando aluno durante aula de kitesurf na lagoa",
        cta: "Agende sua aula",
        whatsappMessage:
          "Olá! Gostaria de agendar uma aula de kitesurf na Kite Suites.",
      },
      {
        slug: "praia",
        title: "Serviços de praia",
        description:
          "Para você aproveitar da melhor maneira seu dia na lagoa ou na praia.",
        icon: "umbrella",
        image: "/images/svc-3.jpg",
        imageAlt: "Cadeiras e guarda-sóis montados na beira da praia",
      },
      {
        slug: "passeios",
        title: "Passeios",
        description:
          "Passeios de bugre, jetski e barco em Praia Seca e Arraial do Cabo com nossos parceiros.",
        icon: "compass",
        image: "/images/svc-4.jpg",
        imageAlt: "Quadriciclo e buggy nas dunas de Praia Seca",
        cta: "Agende seu passeio",
        whatsappMessage:
          "Olá! Gostaria de informações sobre os passeios da Kite Suites.",
      },
    ],
  },

  restaurantPage: {
    pageTitle: "Restaurante",
    pageDescription:
      "Cardápio do restaurante Kite Suites: cafés da manhã, sanduíches, entradas, pratos principais, sobremesas, bebidas e drinks.",
    title: "Restaurante",
    intro:
      "Servido no restaurante de frente para a lagoa, todos os dias das 8h às 18h.",
    currencyNote: "Valores em reais (R$).",
    sections: [
      {
        title: "Café da manhã",
        items: [
          {
            name: "Café Lagoa",
            price: "40",
            description:
              "1 bebida (café, leite, chocolate ou chá) · 1 suco do dia · manteiga, geleia e requeijão · pão (francês, de forma ou fermentação natural) · prato de frios (mussarela, minas, presunto e peito de peru).",
          },
          {
            name: "Café Kite",
            price: "65",
            description:
              "1 bebida (café, leite, chocolate ou chá) · 1 suco do dia · manteiga, geleia, requeijão, mel e granola · fruta do dia · iogurte · pão (francês, de forma ou fermentação natural) · ovos fritos ou mexidos · prato de frios · bolo do dia.",
          },
          {
            name: "Toast (avocado ou bacon)",
            price: "25",
            description:
              "Pão de fermentação natural. Avocado + egg ou toast egg + bacon.",
          },
          {
            name: "Ovos (2 unidades)",
            price: "16",
            description: "Fritos ou mexidos.",
          },
        ],
      },
      {
        title: "Adicionais do café",
        items: [
          { name: "Mel, granola, geleia ou requeijão", price: "8" },
          { name: "Bacon ou prato de frios", price: "12" },
          { name: "Iogurte e mel", price: "10" },
          { name: "Fruta do dia", price: "10" },
        ],
      },
      {
        title: "Sanduíches, pães e bolos",
        items: [
          {
            name: "Misto quente ou queijo quente",
            price: "20",
            description: "Pão de forma ou francês.",
          },
          { name: "Minas com peito de peru", price: "25" },
          { name: "Pão francês na chapa", price: "8" },
          {
            name: "Misto da casa",
            price: "29",
            description:
              "Queijo, presunto e tomate no pão de fermentação natural.",
          },
          { name: "Pão de fermentação na chapa (2 fatias)", price: "13" },
          { name: "Pão de queijo (6 un)", price: "12" },
          { name: "Bolo do dia", price: "12" },
        ],
      },
      {
        title: "Tapioca com grãos de chia ou omelete",
        note: "Escolha 2 itens: queijo prato, queijo minas, presunto, peito de peru, bacon ou banana com mel. Adicione se quiser: tomate, cebola.",
        items: [{ name: "Tapioca ou omelete", price: "25" }],
      },
      {
        title: "Açaí",
        items: [
          {
            name: "Açaí completo",
            price: "30",
            description: "350 ml com banana, melado e granola.",
          },
        ],
      },
      {
        title: "Sanduíches",
        items: [
          {
            name: "Hambúrguer",
            price: "45",
            description: "Queijo, maionese, alface, tomate e fritas.",
          },
          {
            name: "Misto da casa com tomate",
            price: "29",
            description: "Pão de fermentação natural.",
          },
          { name: "Sanduíche natural de frango ou atum", price: "24" },
        ],
      },
      {
        title: "Entradas",
        items: [
          { name: "Mini pastel de queijo (6 un)", price: "22" },
          { name: "Mini pastel de camarão (6 un)", price: "34" },
          {
            name: "Croquete de carne (6 un)",
            price: "24",
            description: "Com maionese de limão.",
          },
          { name: "Bolinho de bacalhau (6 un)", price: "28" },
          { name: "Batata frita com aioli de páprica", price: "29" },
          {
            name: "Ceviche de peixe do dia",
            price: "47",
            description: "Com tortilhas de milho.",
          },
          { name: "Filé mignon acebolado com torradinhas", price: "54" },
          {
            name: "Salada da casa",
            price: "36",
            description:
              "Minas frescal, tomate, ovo cozido, vagem, azeitonas, cebola e molho cítrico.",
          },
        ],
      },
      {
        title: "Pratos principais",
        items: [
          { name: "Penne rigate com ragu de camarão", price: "65" },
          {
            name: "Peixe grelhado",
            price: "68",
            description: "Azeite de ervas, purê de baroa e brócolis.",
          },
          {
            name: "Frango Downwind",
            price: "42",
            description: "Grelhado com arroz, salada, feijão e farofa.",
          },
          {
            name: "Filé mignon",
            price: "83",
            description: "Batata ao murro, vagem e tomatinhos confit.",
          },
        ],
      },
      {
        title: "Menu infantil",
        items: [
          {
            name: "Tirinhas de carne ou frango",
            price: "38",
            description: "Com arroz, feijão e fritas.",
          },
          { name: "Massinha ao sugo", price: "36" },
          { name: "Massinha com tirinhas de carne ou frango", price: "38" },
        ],
      },
      {
        title: "Sobremesas",
        items: [
          { name: "Churros com doce de leite (6 un)", price: "29" },
          { name: "Chocolatudo (Nu Pote)", price: "35" },
          { name: "Torta de limão (Nu Pote)", price: "35" },
        ],
      },
      {
        title: "Bebidas",
        items: [
          { name: "Água", price: "5" },
          { name: "Água com gás", price: "6" },
          { name: "Água tônica", price: "7" },
          { name: "Café expresso", price: "7" },
          { name: "Café filtrado", price: "8" },
          { name: "Café americano ou chá", price: "8" },
          { name: "Cappuccino / mokkaccino", price: "10" },
          { name: "Café com leite", price: "10" },
          { name: "Chocolate quente ou frio", price: "12" },
          { name: "Suco de laranja (300 ml)", price: "15" },
          { name: "Suco fruta do dia (300 ml)", price: "18" },
          { name: "Heineken / Corona / Praya", price: "16" },
          { name: "Mate da casa", price: "12" },
          { name: "Gatorade", price: "10" },
          { name: "Guaraviton", price: "6" },
          { name: "Ice tea", price: "7" },
          { name: "Red Bull", price: "16" },
          { name: "Refrigerante", price: "7" },
          { name: "Suco de uva integral", price: "7" },
          { name: "YoPro / whey", price: "15" },
        ],
      },
      {
        title: "Snacks",
        items: [
          { name: "Amendoim", price: "10" },
          { name: "Barra de proteína", price: "12" },
          { name: "Batata", price: "10" },
          { name: "Paçoca", price: "3" },
          { name: "Talento", price: "10" },
        ],
      },
      {
        title: "Drinks",
        note: "Consulte também a nossa carta de vinhos.",
        items: [
          { name: "Caipirinha", price: "24" },
          { name: "Caipirosca nacional (Smirnoff)", price: "26" },
          { name: "Caipirosca importada (Absolut)", price: "32" },
          { name: "Gin tônica (Tanqueray)", price: "34" },
          { name: "Gin tropical (Tanqueray)", price: "34" },
        ],
      },
    ],
  },

  contact: {
    pageTitle: "Contato",
    pageDescription:
      "Fale com o Kite Suites por WhatsApp ou envie uma mensagem. Atendimento todos os dias das 8h às 18h, em Praia Seca, Araruama - RJ.",
    title: "Você merece",
    intro:
      "Reserve sua estadia, agende uma aula ou tire suas dúvidas. Respondemos todos os dias.",
    directTitle: "Fale direto com a gente",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Telefone",
    hoursLabel: "Atendimento",
    hoursValue: "Todos os dias da semana, das 8h00 às 18h00",
    addressLabel: "Endereço",
    instagramLabel: "Instagram",
    form: {
      title: "Envie uma mensagem",
      name: "Nome",
      namePlaceholder: "Seu nome",
      email: "E-mail",
      emailPlaceholder: "voce@email.com",
      phone: "Telefone",
      phonePlaceholder: "(22) 99999-9999",
      subject: "Assunto",
      subjectOptions: [
        { value: "hospedagem", label: "Hospedagem" },
        { value: "kitesurf", label: "Aula de kitesurf" },
        { value: "restaurante", label: "Restaurante" },
        { value: "passeios", label: "Passeios" },
        { value: "outro", label: "Outro assunto" },
      ],
      message: "Mensagem",
      messagePlaceholder:
        "Conte-nos as datas, quantas pessoas e o que você procura.",
      consent: "Li e aceito a",
      consentLink: "política de privacidade",
      submit: "Enviar mensagem",
      submitting: "A enviar...",
      success: "Mensagem enviada! Entraremos em contato em breve.",
      errorGeneric:
        "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.",
      errorValidation: "Verifique os campos destacados.",
    },
  },

  privacy: {
    pageTitle: "Política de privacidade",
    pageDescription:
      "Como o Kite Suites trata os dados pessoais enviados pelo formulário de contato.",
    updated: "Última atualização: 19 de agosto de 2026",
    body: [
      {
        heading: "Quem somos",
        paragraphs: [
          "Este site é operado pelo Kite Suites, com endereço na Av. Praia dos Nobres, 741 - São Tomé, Praia Seca, Araruama - RJ, 28970-000.",
        ],
      },
      {
        heading: "Dados que recolhemos",
        paragraphs: [
          "Recolhemos apenas os dados que você preenche no formulário de contato: nome, e-mail, telefone (opcional), assunto e mensagem.",
          "Não utilizamos cookies de publicidade. As estatísticas de visita são recolhidas pelo Vercel Analytics de forma anónima e sem cookies.",
        ],
      },
      {
        heading: "Cadastro no clube e presente",
        paragraphs: [
          "Ao pedir o seu presente, recolhemos nome, celular, e-mail e data de nascimento. A data de nascimento serve exclusivamente para lhe enviarmos um mimo no mês do seu aniversário.",
          "A base legal é o seu consentimento, dado ao marcar a caixa no formulário. Pode retirá-lo a qualquer momento pelo WhatsApp +55 22 99988-6066, e deixaremos de lhe enviar comunicações.",
          "Estes cadastros são guardados numa planilha do Google (Google LLC, na qualidade de operador) à qual apenas a nossa equipa tem acesso, e conservados enquanto mantiver o consentimento.",
          "O cadastro é destinado a maiores de 18 anos. Não recolhemos intencionalmente dados de menores de idade.",
        ],
      },
      {
        heading: "Finalidade e base legal",
        paragraphs: [
          "Usamos os seus dados exclusivamente para responder ao seu pedido de reserva ou informação. A base legal é o seu consentimento, dado ao marcar a caixa no formulário.",
        ],
      },
      {
        heading: "Partilha e conservação",
        paragraphs: [
          "As mensagens do formulário são entregues à nossa equipa através do Telegram. Não vendemos nem partilhamos os seus dados com terceiros para fins de marketing.",
          "Conservamos as mensagens apenas pelo tempo necessário para dar seguimento ao seu pedido.",
        ],
      },
      {
        heading: "Os seus direitos",
        paragraphs: [
          "Pode solicitar o acesso, a correção ou a eliminação dos seus dados a qualquer momento pelo WhatsApp +55 22 99988-6066.",
        ],
      },
    ],
  },

  terms: {
    pageTitle: "Termos de uso",
    pageDescription:
      "Condições de utilização do site do Kite Suites e informações sobre reservas.",
    updated: "Última atualização: 19 de agosto de 2026",
    body: [
      {
        heading: "Utilização do site",
        paragraphs: [
          "O conteúdo deste site é disponibilizado a título informativo. Fazemos os melhores esforços para manter preços, acomodações e serviços atualizados, mas podem ocorrer alterações sem aviso prévio.",
        ],
      },
      {
        heading: "Reservas",
        paragraphs: [
          "Este site não processa pagamentos nem confirma reservas automaticamente. Uma reserva só é considerada confirmada após confirmação expressa da nossa equipa por WhatsApp.",
        ],
      },
      {
        heading: "Cardápio e preços",
        paragraphs: [
          "Os valores apresentados no cardápio são em reais (R$) e podem variar consoante a disponibilidade e a época do ano. O cardápio publicado aqui é indicativo.",
        ],
      },
      {
        heading: "Presente de cadastro",
        paragraphs: [
          "O código de presente é pessoal e intransmissível, válido para uma única utilização, não cumulativo com outras promoções e sujeito a disponibilidade.",
          "Reservamo-nos o direito de alterar ou encerrar a campanha a qualquer momento. Códigos já emitidos continuam válidos.",
        ],
      },
      {
        heading: "Propriedade intelectual",
        paragraphs: [
          "As fotografias, marca e textos deste site pertencem ao Kite Suites e não podem ser reutilizados sem autorização.",
        ],
      },
    ],
  },

  footer: {
    rights: "Todos os direitos reservados.",
    navTitle: "Navegação",
    contactTitle: "Contato",
    privacy: "Política de privacidade",
    terms: "Termos de uso",
  },

  localeSwitcher: {
    pt: "PT",
    en: "EN",
    label: "Escolher idioma",
  },
};
