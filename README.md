# Snap Connect
Snap Connect é um projeto desenvolvido para facilitar a integração de pessoas com pouco conhecimento em tecnologia no mundo Web 3.0. O projeto consiste em um bot do Telegram e um website de onboarding que guiam o usuário noob através do processo de criação de uma carteira e mintagem de um NFT para obter acesso a um grupo do Telegram.

## Como funciona
- Um usuário experiente em Web 3.0 compartilha o link do bot do Telegram com um usuário noob.
- O usuário noob inicia uma conversa com o bot, que o guia por uma série de passos em um website de onboarding, como instalar o MetaMask, MetaMask Snaps e criar uma carteira.
- Após o usuário completar os passos, o site permite a mintagem de um NFT que dá acesso a um grupo do Telegram.
- Quando o usuário mintage o NFT, o bot do Telegram envia uma mensagem parabenizando-o pelo feito e fornece um convite único para entrar no grupo.
## Estrutura do repositório
O repositório é composto por três pacotes:

1. Backend
Aqui é onde o bot do Telegram e as integrações necessárias estão localizadas. As principais funcionalidades incluem:

- Comunicação com o usuário através do bot do Telegram.
- Integração com o site de onboarding.
- Geração de convites únicos para o grupo do Telegram.
2. Contracts
Nesta parte, você encontrará o contrato de NFT que atua como gatekeeper do grupo. Ele inclui:

- Contrato inteligente do NFT.
- Funções para mintar o NFT e verificar a propriedade.
- Integração com o backend e o frontend.
3. Frontend
Aqui está o site que contém os tutoriais e os passos para guiar o usuário noob. As funcionalidades incluem:

- Interface amigável e didática para guiar o usuário noob no processo.
- Integração com o MetaMask e MetaMask Snaps.
- Instruções para criar uma carteira.
- Interface para mintar o NFT de acesso ao grupo do Telegram.
## Instruções de instalação e uso
1. Faça o clone do repositório.
2. Instale as dependências de cada pacote (backend, contracts e frontend) com npm install.
3. Configure as variáveis de ambiente, como a chave da API do Telegram e as credenciais do contrato inteligente.
4. Inicie o backend com npm start no diretório do pacote backend.
5. Faça o deploy do contrato inteligente seguindo as instruções no diretório do pacote contracts.
6. Inicie o frontend com npm start no diretório do pacote frontend.
7. Compartilhe o link do bot do Telegram com os usuários noobs e comece a ajudá-los a entrar no mundo Web 3.0!

Boa sorte na hackathon! Este README detalhado e avançado deve ajudá-lo a apresentar o projeto Snap Connect de forma clara e organizada.





