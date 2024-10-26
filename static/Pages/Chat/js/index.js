import Socket from './socket.js'

document.addEventListener('DOMContentLoaded', () => {
    // Obtenha o modal
    const modal = document.getElementById("myModal");
    // Obtenha o link que abre o modal
    const openPopup = document.getElementById("open-popup");
    // Obtenha o botão de fechar
    const fecharBtn = document.getElementById("fechar");
    // Obtenha o botão de confirmar
    const confirmarBtn = document.getElementById("confirmar");

    const socket = new Socket(); // Instancia a classe Socket
    
    openPopup.onclick = (event) => {
        event.preventDefault(); // Impede a ação padrão do link
        modal.style.display = "block"; // Use this.modal para se referir ao modal
    }
    openPopup.click()

    // Quando o usuário clicar no botão de fechar, feche o modal
    fecharBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    // Quando o usuário clicar em confirmar
    confirmarBtn.onclick = function() {
        const selectedValue = document.querySelector('input[name="termo"]:checked');
    
        if (selectedValue) { // Verifique se uma opção foi selecionada
            if (selectedValue.value === 'sim') {
                openPopup.style.display = "none";
                socket.conectar();
                console.log(selectedValue.value)
            }
        } else {
            alert("Por favor, selecione uma opção.");
        }
        modal.style.display = "none"; // Fecha o modal
    }
    
    // Fechar o modal se o usuário clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});