import { useState } from 'react';

export default function CotacaoForm() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const handleBuscar = async (e) => {
    e.preventDefault();

    // Converte data para o formato AAAAMMDD
    const formatarData = (data) => {
      return data.replaceAll('-', '');
    };

    const inicioFormatado = formatarData(dataInicio);
    const fimFormatado = formatarData(dataFim);

    const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${inicioFormatado}&end_date=${fimFormatado}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar cotação');
      }

      const data = await response.json();
      setResultado(data);
      setErro('');
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao buscar os dados da API.');
      setResultado(null);
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Buscar Cotação USD/BRL</h1>

      <form onSubmit={handleBuscar}>
        <label>
          Data Início:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Data Fim:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </label>
        <br />

        <button type="submit">Buscar</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {resultado && (
        <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem' }}>
          <h2>Resultado:</h2>
          <ul>
            {resultado.map((item) => (
              <li key={item.timestamp}>
                Data: {new Date(item.timestamp * 1000).toLocaleDateString('pt-BR')} | 
                Alta: {item.high} | 
                Baixa: {item.low} | 
                Fechamento: {item.bid}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
