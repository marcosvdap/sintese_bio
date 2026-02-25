// =======================================================
// 🚀 CONFIGURAÇÃO DE AMBIENTE - AZURE AD
// =======================================================
// =======================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const msal = require('@azure/msal-node');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5000;

// =======================================================
// 🚀 CONFIGURAÇÃO MSAL (Microsoft Authentication)
// =======================================================
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};
const cca = new msal.ConfidentialClientApplication(msalConfig);

// =======================================================
// 🚀 FUNÇÃO PARA ENVIAR EMAIL VIA MICROSOFT GRAPH API
// =======================================================
async function enviarEmailViaGraph(mailOptions) {
  console.log("🔄 Obtendo token de acesso do Microsoft Graph...");

  const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  const response = await cca.acquireTokenByClientCredential(tokenRequest);

  if (!response || !response.accessToken) {
    throw new Error("Falha ao adquirir token de acesso.");
  }

  console.log("✅ Token obtido para Microsoft Graph!");

  // Construir mensagem no formato do Graph API
  const message = {
    message: {
      subject: mailOptions.subject,
      body: {
        contentType: "HTML",
        content: mailOptions.html
      },
      toRecipients: [
        {
          emailAddress: {
            address: mailOptions.to
          }
        }
      ]
    },
    saveToSentItems: "true"
  };

  // Enviar via Microsoft Graph API
  const graphResponse = await fetch(
    `https://graph.microsoft.com/v1.0/users/${process.env.AZURE_EMAIL_USER}/sendMail`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${response.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    }
  );

  if (!graphResponse.ok) {
    const errorText = await graphResponse.text();
    console.error("❌ Erro do Graph API:", errorText);
    throw new Error(`Erro ao enviar email: ${graphResponse.status} - ${errorText}`);
  }

  console.log("✅ Email enviado com sucesso via Microsoft Graph!");
  
  return { 
    messageId: `graph-${Date.now()}`,
    accepted: [mailOptions.to]
  };
}

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { router: authRouter } = require('./Auth');

// Servir arquivos estáticos
const imagensPath = path.join(__dirname, 'public/Imagens');
app.use('/Imagens', express.static(imagensPath));

// =======================================================
// 📁 CONFIGURAÇÃO DO MULTER (Upload de Imagens)
// =======================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/Imagens/produtos';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extensao = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extensao);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem não suportado! Use apenas JPEG, PNG ou WebP.'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
});

// =======================================================
// 🖼️ ROTA PARA UPLOAD DE IMAGEM
// =======================================================
app.post('/api/upload-imagem', upload.single('imagemProduto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
  }

  console.log('🖼️ Imagem recebida:', req.file.filename);

  const filePath = `/Imagens/produtos/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    message: 'Imagem enviada com sucesso!',
    filePath: filePath
  });
}, (error, req, res, next) => {
  res.status(500).json({ success: false, message: error.message });
});

// =======================================================
// ROTAS EXISTENTES
// =======================================================
const produtosRoutes = require('./produtos');
app.use('/api/produtos', produtosRoutes);

app.use('/api/auth', authRouter);

const eventosRoutes = require('./eventos');
app.use('/api/eventos', eventosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando com SQLite!' });
});

// =======================================================
// 🚀 ROTA PARA ENVIAR E-MAIL DE PEDIDO
// =======================================================
app.post("/api/enviar-email", async (req, res) => {
  console.log("\n📨 Nova requisição de e-mail recebida");
  console.log("📍 Timestamp:", new Date().toISOString());

  const { nome, email, telefone, instituicao, dataEntrega, parcelas, itens } = req.body;

  // Validações
  const camposFaltando = [];
  if (!nome) camposFaltando.push("nome");
  if (!email) camposFaltando.push("email");
  if (!telefone) camposFaltando.push("telefone");
  if (!itens || itens.length === 0) camposFaltando.push("itens");

  if (camposFaltando.length > 0) {
    console.error("❌ Campos faltando:", camposFaltando);
    return res.status(400).json({
      success: false,
      message: `Campos obrigatórios faltando: ${camposFaltando.join(", ")}`
    });
  }

  try {
    // 🔹 1) E-mail para a LOJA
    const mailToStore = {
      to: process.env.AZURE_EMAIL_USER,
      subject: "🛒 Novo Pedido Recebido",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🛒 Novo Pedido Recebido</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h3>Dados do Cliente:</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Instituição:</strong> ${instituicao || 'Não informado'}</p>
            <p><strong>Data de Entrega:</strong> ${dataEntrega || 'Não informado'}</p>
            <p><strong>Plano de Compra:</strong> ${parcelas || 'Não informado'}</p>
          </div>
          <h3 style="margin-top: 20px;">📦 Itens do Pedido:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #e0e0e0;">
                <th style="padding: 10px; text-align: left;">Produto</th>
                <th style="padding: 10px; text-align: left;">Fabricante</th>
                <th style="padding: 10px; text-align: center;">Código</th>
                <th style="padding: 10px; text-align: center;">Qtd</th>
                <th style="padding: 10px; text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${itens.map(item => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px;">${item.nome}</td>
                  <td style="padding: 10px;">${item.categoria}</td>
                  <td style="padding: 10px;text-align: center;">${item.codigofabricante || '-'}</td>
                  <td style="padding: 10px; text-align: center;">${item.quantidade}</td>
                  <td style="padding: 10px; text-align: right;">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Pedido recebido em ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
    };

    // 🔹 2) E-mail para o CLIENTE
    const mailToCustomer = {
      to: email,
      subject: "✅ Pedido Confirmado - Loja Online",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">
              ✅ Pedido Confirmado!
            </h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Olá, ${nome}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Recebemos seu pedido com sucesso e já estamos preparando tudo com muito carinho! 🎉
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                📋 Resumo do Pedido:
              </h3>
              <table style="width: 100%; margin-top: 15px;">
                ${itens.map(item => `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong>${item.nome}</strong>
                    </td>
                    <td style="text-align: center; padding: 8px;">
                      x${item.quantidade}
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                `).join("")}
              </table>
            </div>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>📞 Próximos passos:</strong><br>
                Em breve entraremos em contato pelo telefone ${telefone} para confirmar a entrega.
              </p>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #666;">
              Obrigado por comprar conosco! 💙
            </p>
          </div>
        </div>
      `,
    };

    // Enviar e-mails via Microsoft Graph
    console.log("📤 Enviando e-mail para a loja...");
    const infoStore = await enviarEmailViaGraph(mailToStore);
    console.log("✅ E-mail para loja enviado!");

    console.log("📤 Enviando e-mail para o cliente:", email);
    const infoCustomer = await enviarEmailViaGraph(mailToCustomer);
    console.log("✅ E-mail para cliente enviado!");

    res.status(200).json({
      success: true,
      message: "Pedido enviado com sucesso!",
      details: {
        loja: infoStore.messageId,
        cliente: infoCustomer.messageId
      }
    });

  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar e-mail.",
      error: error.message
    });
  }
});

// =======================================================
// 📧 ROTA PARA ENVIAR E-MAIL DE CONTATO
// =======================================================
app.post("/api/contato", async (req, res) => {
  console.log("\n📨 Nova requisição de contato recebida");

  const { nome, email, telefone, mensagem } = req.body;

  if (!nome || !email || !telefone || !mensagem) {
    return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
  }

  try {
    const mailToCompany = {
      to: process.env.AZURE_EMAIL_USER,
      subject: "📩 Nova Mensagem de Contato - Site Síntese",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #253785; padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">
              📩 Nova Mensagem de Contato
            </h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #253785; margin-top: 0;">Dados do Contato:</h3>
              <p style="margin: 10px 0;"><strong>Nome:</strong> ${nome}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Telefone:</strong> ${telefone}</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #253785; margin-top: 0;">Mensagem:</h3>
              <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">${mensagem}</p>
            </div>
          </div>
        </div>
      `,
    };

    const mailToCustomer = {
      to: email,
      subject: "✅ Recebemos sua mensagem - Síntese Biotecnologia",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #253785 0%, #39bde6 100%); padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">
              ✅ Mensagem Recebida!
            </h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #253785;">Olá, ${nome}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Obrigado por entrar em contato com a Síntese Biotecnologia! 🎉
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Recebemos sua mensagem e nossa equipe entrará em contato em breve.
            </p>
          </div>
        </div>
      `,
    };

    console.log("📤 Enviando e-mails...");
    await enviarEmailViaGraph(mailToCompany);
    await enviarEmailViaGraph(mailToCustomer);
    
    console.log("✅ E-mails enviados com sucesso!");

    res.status(200).json({
      success: true,
      message: "Mensagem enviada com sucesso!"
    });

  } catch (error) {
    console.error("❌ Erro ao enviar e-mail de contato:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar e-mail de contato.",
      error: error.message
    });
  }
});

// =======================================================
// 🚨 ROTA PARA ENVIAR E-MAIL DE DENÚNCIA
// =======================================================
app.post("/api/denuncia", async (req, res) => {
  console.log("\n🚨 Nova denúncia recebida");

  const { nome, email, mensagem } = req.body;

  if (!mensagem || mensagem.trim() === "") {
    return res.status(400).json({ success: false, message: "O campo mensagem é obrigatório" });
  }

  try {
    const nomeExibicao = nome && nome.trim() !== "" ? nome : "Anônimo";
    const emailExibicao = email && email.trim() !== "" ? email : "Não informado";
    const temEmail = email && email.trim() !== "";

    const mailToCompany = {
      to: process.env.AZURE_EMAIL_USER,
      subject: "🚨 Nova Denúncia Recebida - Site Síntese",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #d32f2f; padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">
              🚨 Nova Denúncia Recebida
            </h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #d32f2f; margin-top: 0;">Dados do Denunciante:</h3>
              <p style="margin: 10px 0;"><strong>Nome:</strong> ${nomeExibicao}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${emailExibicao}</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #d32f2f; margin-top: 0;">Denúncia:</h3>
              <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">${mensagem}</p>
            </div>
          </div>
        </div>
      `,
    };

    await enviarEmailViaGraph(mailToCompany);

    if (temEmail) {
      const mailToCustomer = {
        to: email,
        subject: "✅ Denúncia recebida - Síntese Biotecnologia",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #253785 0%, #39bde6 100%); padding: 30px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; text-align: center; margin: 0;">
                ✅ Denúncia Recebida
              </h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #253785;">Olá${nome ? `, ${nome}` : ''}!</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Recebemos sua denúncia e agradecemos por nos alertar sobre esta situação.
              </p>
            </div>
          </div>
        `,
      };
      await enviarEmailViaGraph(mailToCustomer);
    }

    res.status(200).json({
      success: true,
      message: "Denúncia enviada com sucesso!"
    });

  } catch (error) {
    console.error("❌ Erro ao enviar denúncia:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar denúncia.",
      error: error.message
    });
  }
});

// Configuração para produção
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`🗄️  Banco de dados SQLite ativo`);
  console.log(`🖼️  Imagens servidas de: ${imagensPath}`);
  console.log(`📧 Email Azure configurado: ${process.env.AZURE_EMAIL_USER ? '✅' : '❌'}`);
  console.log(`🔑 Client ID: ${process.env.AZURE_CLIENT_ID ? '✅' : '❌'}`);
  console.log(`🔒 Client Secret: ${process.env.AZURE_CLIENT_SECRET ? '✅' : '❌'}`);
  console.log(`${'='.repeat(50)}\n`);
});
