// CONFIGURAÇÃO – tu vai pegar no Supabase depois
const SUPABASE_URL = "COLOCA_AQUI";
const SUPABASE_ANON = "COLOCA_AQUI";

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
