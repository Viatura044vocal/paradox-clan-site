// CONFIGURAÇÃO – tu vai pegar no Supabase depois
const SUPABASE_URL = "https://imivvngmmpzfdylhvlog.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaXZ2bmdtbXB6ZmR5bGh2bG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzIwMzQsImV4cCI6MjA3OTE0ODAzNH0.eDNKT7D0iW7-mTlhA181swP9lPfzcph2_W6Ek-_Zr_k";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON);

// LISTAR ITENS DO ESTOQUE
async function carregarItens() {
    const { data, error } = await supabase
        .from("itens")
        .select("*")
        .order("nome");

    if (error) {
        console.log(error);
        return;
    }

    const div = document.getElementById("lista-itens");
    div.innerHTML = "";

    data.forEach(i => {
        div.innerHTML += `
            <div>
                <b>${i.nome}</b><br>
                Quantidade: ${i.quantidade}
            </div>
        `;
    });
}

// ENVIAR PEDIDO
async function criarPedido() {
    const nickname = document.getElementById("nick").value;
    const item = document.getElementById("item").value;
    const qtd = parseInt(document.getElementById("qtd").value);
    const motivo = document.getElementById("motivo").value;

    if (!nickname || !item || !qtd) {
        document.getElementById("msg").innerText = "Preencha tudo!";
        return;
    }

    // Busca o usuário pelo nick
    let { data: users } = await supabase
        .from("usuarios")
        .select("*")
        .eq("nickname", nickname);

    let userId;

    if (users.length === 0) {
        // Cria automaticamente o usuário
        const { data: novo } = await supabase
            .from("usuarios")
            .insert([{ nickname: nickname }])
            .select();
        userId = novo[0].id;
    } else {
        userId = users[0].id;
    }

    // Cria pedido
    const { data, error } = await supabase
        .from("pedidos")
        .insert([{ usuario_id: userId, item_id: null, quantidade: qtd, motivo }]);

    document.getElementById("msg").innerText = "Pedido enviado!";
}

// Carrega itens no início
carregarItens();
