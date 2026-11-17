import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Dataset completo com as 75 unidades em Recife
const baseUnitsData = [
    { id: 1, name: "Secretaria da Casa Civil", category: "Secretaria", address: "Palácio do Campo das Princesas, Praça da República, s/n - Santo Antônio, Recife", lat: -8.0617, lng: -34.8770, phone: "(81) 3181-2100", contactName: "Genilson Santos", email: "casacivil@pe.gov.br", status: "operacional", tickets: [] },
    { id: 2, name: "Secretaria da Fazenda (SEFAZ-PE)", category: "Secretaria", address: "Rua Imperador Dom Pedro II, fte. Praça da Independência - Santo Antônio, Recife", lat: -8.0632, lng: -34.8754, phone: "(81) 3181-1200", contactName: "Maria Clara Bezerra", email: "atendimento@sefaz.pe.gov.br", status: "operacional", tickets: [] },
    { id: 3, name: "Secretaria de Administração (SAD)", category: "Secretaria", address: "Av. General Edgar Corréa de Lima, 630 - Santo Amaro, Recife", lat: -8.0550, lng: -34.8820, phone: "(81) 3183-8000", contactName: "Carlos Eduardo Melo", email: "sad@sad.pe.gov.br", status: "operacional", tickets: [] },
    { id: 4, name: "Secretaria de Educação e Esportes (SEE)", category: "Secretaria", address: "Av. Afonso Olindense, 1513 - Várzea, Recife", lat: -8.0489, lng: -34.9512, phone: "(81) 3183-9200", contactName: "Ana Paula Vasconcelos", email: "contato@educacao.pe.gov.br", status: "operacional", tickets: [] },
    { id: 5, name: "Secretaria de Saúde (SES-PE)", category: "Secretaria", address: "Rua Dona Maria Augusta Nogueira, 519 - Bongi, Recife", lat: -8.0675, lng: -34.9123, phone: "(81) 3184-0000", contactName: "Dr. Roberto Cavalcanti", email: "ouvidoria@saude.pe.gov.br", status: "operacional", tickets: [] },
    { id: 6, name: "Secretaria de Defesa Social (SDS)", category: "Secretaria", address: "Rua São Geraldo, 111 - Santo Amaro, Recife", lat: -8.0523, lng: -34.8789, phone: "(81) 3183-5200", contactName: "Cel. Marcones Silva", email: "sds@sds.pe.gov.br", status: "operacional", tickets: [] },
    { id: 7, name: "Secretaria de Infraestrutura e Recursos Hídricos (SEIRH)", category: "Secretaria", address: "Av. Cruz Cabugá, 1111 - Santo Amaro, Recife", lat: -8.0465, lng: -34.8750, phone: "(81) 3181-3000", contactName: "Fernanda Albuquerque", email: "seirh@seirh.pe.gov.br", status: "operacional", tickets: [] },
    { id: 8, name: "Secretaria de Desenvolvimento Econômico", category: "Secretaria", address: "Pq. Industrial de Curado, Recife", lat: -8.0820, lng: -34.9650, phone: "(81) 3181-4000", contactName: "Bruno Cavalcanti", email: "sde@sde.pe.gov.br", status: "operacional", tickets: [] },
    { id: 9, name: "Secretaria de Ciência, Tecnologia e Inovação (SECTI)", category: "Secretaria", address: "Porto Digital - Cais do Apolo, 222 - Recife Antigo, Recife", lat: -8.0610, lng: -34.8715, phone: "(81) 3184-5500", contactName: "Luciana Santos", email: "secti@secti.pe.gov.br", status: "operacional", tickets: [] },
    { id: 10, name: "Secretaria de Turismo e Lazer (Setur)", category: "Secretaria", address: "Centro de Convenções de Pernambuco - Salgadinho / Olinda-Recife", lat: -8.0280, lng: -34.8650, phone: "(81) 3182-8000", contactName: "Eduardo Amorim", email: "setur@turismo.pe.gov.br", status: "operacional", tickets: [] },
    { id: 11, name: "COMPESA (Companhia Pernambucana de Saneamento) - Sede", category: "Empresa Pública", address: "Av. Cruz Cabugá, 1387 - Santo Amaro, Recife", lat: -8.0440, lng: -34.8725, phone: "0800 081 0195", contactName: "Sérgio Leite", email: "atendimento@compesa.com.br", status: "operacional", tickets: [] },
    { id: 12, name: "DETRAN-PE (Sede e Central de Atendimento)", category: "Órgão de Segurança e Trânsito", address: "Estrada do Barbalho, 889 - Iputinga, Recife", lat: -8.0350, lng: -34.9350, phone: "(81) 3184-8000", contactName: "Wladimir Mota", email: "ouvidoria@detran.pe.gov.br", status: "operacional", tickets: [] },
    { id: 13, name: "ATI (Agência de Tecnologia da Informação de PE)", category: "Autarquia / Fundação", address: "Av. Rio Branco, 155 - Recife Antigo, Recife", lat: -8.0625, lng: -34.8710, phone: "(81) 3183-1000", contactName: "Danilo Benício", email: "contato@ati.pe.gov.br", status: "operacional", tickets: [] },
    { id: 14, name: "DER-PE (Departamento de Estradas de Rodagem)", category: "Autarquia / Fundação", address: "Av. Abdias de Carvalho, 1750 - Madalena, Recife", lat: -8.0580, lng: -34.9100, phone: "(81) 3181-2200", contactName: "Maurício Holanda", email: "der@der.pe.gov.br", status: "operacional", tickets: [] },
    { id: 15, name: "Empresa Pernambucana de Transporte Intermunicipal (EPTIN)", category: "Empresa Pública", address: "Terminal Integrado TIP - Caxangá, Recife", lat: -8.0510, lng: -34.9450, phone: "(81) 3182-3300", contactName: "Ricardo Vasconcelos", email: "contato@eptin.pe.gov.br", status: "operacional", tickets: [] },
    { id: 16, name: "Fundação de Patrimônio Histórico e Artístico (FUNDARPE)", category: "Autarquia / Fundação", address: "Rua da Aurora, 463 - Boa Vista, Recife", lat: -8.0580, lng: -34.8810, phone: "(81) 3184-3000", contactName: "Kátia Cunha", email: "fundarpe@cultura.pe.gov.br", status: "operacional", tickets: [] },
    { id: 17, name: "Agência de Regulação de Pernambuco (ARPE)", category: "Autarquia / Fundação", address: "Av. Conselheiro Rosa e Silva, 800 - Aflitos, Recife", lat: -8.0390, lng: -34.9010, phone: "(81) 3181-7000", contactName: "Luciano Bezerra", email: "arpe@arpe.pe.gov.br", status: "operacional", tickets: [] },
    { id: 18, name: "Agência Pernambucana de Águas e Clima (APAC)", category: "Autarquia / Fundação", address: "Av. Rui Barbosa, 1246 - Graças, Recife", lat: -8.0430, lng: -34.8970, phone: "(81) 3181-2400", contactName: "Marcelo Rodrigues", email: "apac@apac.pe.gov.br", status: "operacional", tickets: [] },
    { id: 19, name: "Instituto de Recursos Humanos (IRH-PE)", category: "Autarquia / Fundação", address: "Rua Gervásio Pires, 394 - Boa Vista, Recife", lat: -8.0610, lng: -34.8850, phone: "(81) 3183-7500", contactName: "Cláudia Mendonça", email: "irh@irh.pe.gov.br", status: "operacional", tickets: [] },
    { id: 20, name: "Junta Comercial do Estado de Pernambuco (JUCEPE)", category: "Autarquia / Fundação", address: "Rua Imperial, 387 - São José, Recife", lat: -8.0710, lng: -34.8830, phone: "(81) 3182-5300", contactName: "Marcos Santana", email: "jucepe@jucepe.pe.gov.br", status: "operacional", tickets: [] },
    { id: 21, name: "Prefeitura do Recife (PCR) - Sede / Cais do Apolo", category: "Secretaria", address: "Av. Cais do Apolo, 925 - Recife Antigo, Recife", lat: -8.0628, lng: -34.8722, phone: "0800 081 6200", contactName: "João Campos (Gabinete)", email: "ouvidoria@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 22, name: "Secretaria de Educação do Recife", category: "Secretaria", address: "Rua Real da Torre, 299 - Madalena, Recife", lat: -8.0520, lng: -34.9040, phone: "(81) 3355-5900", contactName: "Fred Amancio", email: "educacao@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 23, name: "Secretaria de Saúde do Recife", category: "Secretaria", address: "Cais do Apolo, 925 - 13º andar - Recife Antigo, Recife", lat: -8.0620, lng: -34.8720, phone: "(81) 3355-8200", contactName: "Luciana Albuquerque", email: "saude@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 24, name: "CTTU (Autarquia de Trânsito e Transporte Urbano do Recife)", category: "Órgão de Segurança e Trânsito", address: "Rua Frei Cassimiro, 91 - Santo Amaro, Recife", lat: -8.0490, lng: -34.8760, phone: "0800 081 1078", contactName: "Matheus Freitas", email: "cttu@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 25, name: "EMLURB (Autarquia de Manutenção e Limpeza Urbana)", category: "Autarquia / Fundação", address: "Av. Agamenon Magalhães, s/n - Santo Amaro, Recife", lat: -8.0540, lng: -34.8870, phone: "156 / (81) 3355-5555", contactName: "Marcos Fernando", email: "emlurb@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 26, name: "Secretaria de Finanças do Recife", category: "Secretaria", address: "Av. Cais do Apolo, 925 - Recife Antigo, Recife", lat: -8.0630, lng: -34.8725, phone: "(81) 3355-2300", contactName: "Ricardo Dantas", email: "financas@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 27, name: "Secretaria de Desenvolvimento Social e Direitos Humanos", category: "Secretaria", address: "Rua do Imperador Pedro II, 307 - Santo Antônio, Recife", lat: -8.0640, lng: -34.8765, phone: "(81) 3355-3600", contactName: "Ana Rita Suassuna", email: "desenvolvimentosocial@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 28, name: "Secretaria de Meio Ambiente e Sustentabilidade (SMAS)", category: "Secretaria", address: "Rua Dom Bosco, 555 - Boa Vista, Recife", lat: -8.0560, lng: -34.8910, phone: "(81) 3355-4800", contactName: "Carlos Ribeiro", email: "meioambiente@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 29, name: "Secretaria de Política Urbana e Licenciamento (SPUL)", category: "Secretaria", address: "Cais do Apolo, 925 - Recife Antigo, Recife", lat: -8.0635, lng: -34.8720, phone: "(81) 3355-2000", contactName: "Luciana Correa", email: "licenciamento@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 30, name: "Guarda Municipal do Recife", category: "Órgão de Segurança e Trânsito", address: "Rua do Pombal, 597 - Santo Amaro, Recife", lat: -8.0480, lng: -34.8790, phone: "153 / (81) 3355-3333", contactName: "Inspetor Marcílio", email: "guardamunicipal@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 31, name: "Tribunal de Justiça de Pernambuco (TJPE) - Palácio da Justiça", category: "Autarquia / Fundação", address: "Praça da República, s/n - Santo Antônio, Recife", lat: -8.0610, lng: -34.8760, phone: "(81) 3182-0000", contactName: "Des. Ricardo Paes Barreto", email: "ouvidoria@tjpe.jus.br", status: "operacional", tickets: [] },
    { id: 32, name: "Assembleia Legislativa de Pernambuco (ALEPE)", category: "Autarquia / Fundação", address: "Rua da União, 397 - Boa Vista, Recife", lat: -8.0565, lng: -34.8845, phone: "(81) 3183-2000", contactName: "Dep. Álvaro Porto", email: "alepe@alepe.pe.gov.br", status: "operacional", tickets: [] },
    { id: 33, name: "Ministério Público de Pernambuco (MPPE)", category: "Autarquia / Fundação", address: "Rua do Imperador Pedro II, 473 - Santo Antônio, Recife", lat: -8.0645, lng: -34.8770, phone: "(81) 3182-7000", contactName: "Dr. Marcos Carvalho", email: "ouvidoria@mppe.mp.br", status: "operacional", tickets: [] },
    { id: 34, name: "Universidade de Pernambuco (UPE) - Reitoria", category: "Autarquia / Fundação", address: "Av. Agamenon Magalhães, s/n - Santo Amaro, Recife", lat: -8.0535, lng: -34.8875, phone: "(81) 3183-3600", contactName: "Profa. Socorrinho Cavalcanti", email: "reitoria@upe.br", status: "operacional", tickets: [] },
    { id: 35, name: "Empresa de Turismo de Pernambuco (EMPETUR)", category: "Empresa Pública", address: "Centro de Convenções de Pernambuco - Salgadinho, Recife", lat: -8.0285, lng: -34.8655, phone: "(81) 3182-8100", contactName: "Antonio Neves", email: "empetur@empetur.pe.gov.br", status: "operacional", tickets: [] },
    { id: 36, name: "Porto do Recife S/A", category: "Empresa Pública", address: "Armazém 7 - Av. da Cais do Porto - Recife Antigo, Recife", lat: -8.0615, lng: -34.8685, phone: "(81) 3424-4455", contactName: "Delmiro Gouveia", email: "contato@portodorecife.com.br", status: "operacional", tickets: [] },
    { id: 37, name: "Detran - Unidade Afogados / Expresso Cidadão", category: "Órgão de Segurança e Trânsito", address: "Terminal Integrado de Afogados - Recife", lat: -8.0810, lng: -34.9020, phone: "(81) 3184-8200", contactName: "Silvana Mello", email: "expressoafogados@detran.pe.gov.br", status: "operacional", tickets: [] },
    { id: 38, name: "Expresso Cidadão - Shopping Boa Vista", category: "Autarquia / Fundação", address: "Rua do Hospício, 351 - Boa Vista, Recife", lat: -8.0585, lng: -34.8870, phone: "(81) 3183-8200", contactName: "Juliana Pimentel", email: "expressoboavista@sad.pe.gov.br", status: "operacional", tickets: [] },
    { id: 39, name: "Expresso Cidadão - Shopping RioMar", category: "Autarquia / Fundação", address: "Av. República do Líbano, 251 - Pina, Recife", lat: -8.0870, lng: -34.8770, phone: "(81) 3183-8300", contactName: "Renato Gusmão", email: "expressoriomar@sad.pe.gov.br", status: "operacional", tickets: [] },
    { id: 40, name: "Fundação Hemope (Centro de Hemoterapia)", category: "Autarquia / Fundação", address: "Rua Joaquim Nabuco, 171 - Graças, Recife", lat: -8.0445, lng: -34.8960, phone: "(81) 3182-4600", contactName: "Dra. Raquel Duarte", email: "hemope@hemope.pe.gov.br", status: "operacional", tickets: [] },
    { id: 41, name: "Procon Pernambuco (Sede)", category: "Autarquia / Fundação", address: "Rua Floriano Peixoto, 141 - Santo Antônio, Recife", lat: -8.0620, lng: -34.8750, phone: "0800 282 1512", contactName: "Hugo Souza", email: "procon@procon.pe.gov.br", status: "operacional", tickets: [] },
    { id: 42, name: "Delegacia Geral da Polícia Civil de PE", category: "Órgão de Segurança e Trânsito", address: "Rua da Aurora, 487 - Boa Vista, Recife", lat: -8.0575, lng: -34.8815, phone: "(81) 3184-3500", contactName: "Delegado Renato Leite", email: "policiacivil@policiacivil.pe.gov.br", status: "operacional", tickets: [] },
    { id: 43, name: "Quartel do Comando Geral da PMPE", category: "Órgão de Segurança e Trânsito", address: "Praça do Quartel, 50 - Derby, Recife", lat: -8.0530, lng: -34.8950, phone: "(81) 3181-1100", contactName: "Coronel Silva Junior", email: "pmpe@pm.pe.gov.br", status: "operacional", tickets: [] },
    { id: 44, name: "Companhia de Processamento de Dados de Pernambuco (DEX/CEPE)", category: "Empresa Pública", address: "Rua da Aurora, 529 - Boa Vista, Recife", lat: -8.0570, lng: -34.8820, phone: "(81) 3183-4000", contactName: "Paulo Henrique", email: "contato@cepe.com.br", status: "operacional", tickets: [] },
    { id: 45, name: "Fundação de Atendimento Socioeducativo (FUNASE)", category: "Autarquia / Fundação", address: "Estrada do Arraial, 3647 - Casa Amarela, Recife", lat: -8.0320, lng: -34.9120, phone: "(81) 3184-5100", contactName: "Norma Lacerda", email: "funase@funase.pe.gov.br", status: "operacional", tickets: [] },
    { id: 46, name: "Secretaria da Mulher de Pernambuco", category: "Secretaria", address: "Rua da Aurora, 463 - Boa Vista, Recife", lat: -8.0578, lng: -34.8812, phone: "(81) 3181-3300", contactName: "Agta Rodrigues", email: "secmulher@sec.pe.gov.br", status: "operacional", tickets: [] },
    { id: 47, name: "Secretaria da Mulher do Recife", category: "Secretaria", address: "Av. Cais do Apolo, 925 - Recife Antigo, Recife", lat: -8.0625, lng: -34.8728, phone: "(81) 3355-8400", contactName: "Glauce Medeiros", email: "mulher@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 48, name: "Secretaria de Juventude e Qualificação do Recife", category: "Secretaria", address: "Av. Rio Branco, 155 - Recife Antigo, Recife", lat: -8.0620, lng: -34.8718, phone: "(81) 3355-2500", contactName: "Marco Aurélio", email: "juventude@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 49, name: "Escola de Contas Professor João Gilberto (TCE-PE)", category: "Autarquia / Fundação", address: "R. da Aurora, 885 - Santo Amaro, Recife", lat: -8.0535, lng: -34.8780, phone: "(81) 3181-1400", contactName: "Eduardo Lyra", email: "escola@tce.pe.gov.br", status: "operacional", tickets: [] },
    { id: 50, name: "Tribunal de Contas do Estado (TCE-PE)", category: "Autarquia / Fundação", address: "R. da Aurora, 885 - Santo Amaro, Recife", lat: -8.0532, lng: -34.8782, phone: "(81) 3181-1500", contactName: "Conselheiro Dirceu Rodolfo", email: "ouvidoria@tce.pe.gov.br", status: "operacional", tickets: [] },
    { id: 51, name: "Secretaria de Planejamento, Gestão e Desenvolvimento Regional (SEPLAG)", category: "Secretaria", address: "Rua da Aurora, 1377 - Santo Amaro, Recife", lat: -8.0495, lng: -34.8775, phone: "(81) 3183-8100", contactName: "Fabrício Marques", email: "seplag@seplag.pe.gov.br", status: "operacional", tickets: [] },
    { id: 52, name: "Companhia Editora de Pernambuco (CEPE)", category: "Empresa Pública", address: "Rua Marquês de Olinda, 274 - Recife Antigo, Recife", lat: -8.0605, lng: -34.8705, phone: "(81) 3183-2700", contactName: "Ricardo Leitão", email: "cepe@cepe.com.br", status: "operacional", tickets: [] },
    { id: 53, name: "Fundação Joaquim Nabuco (FUNDAJ) - Campus Apacudos", category: "Autarquia / Fundação", address: "Av. 17 de Agosto, 2187 - Casa Forte, Recife", lat: -8.0350, lng: -34.9220, phone: "(81) 3073-6300", contactName: "Joaquim Falcão", email: "fundaj@fundaj.gov.br", status: "operacional", tickets: [] },
    { id: 54, name: "Museu do Estado de Pernambuco (MEPE)", category: "Autarquia / Fundação", address: "Av. Rui Barbosa, 960 - Graças, Recife", lat: -8.0460, lng: -34.8980, phone: "(81) 3184-3170", contactName: "Margot Monteiro", email: "mepe@cultura.pe.gov.br", status: "operacional", tickets: [] },
    { id: 55, name: "Teatro de Santa Isabel", category: "Autarquia / Fundação", address: "Praça da República, s/n - Santo Antônio, Recife", lat: -8.0608, lng: -34.8782, phone: "(81) 3355-3323", contactName: "Rebeca Gondim", email: "teatro.santaisabel@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 56, name: "Centro de Artesanato de Pernambuco", category: "Autarquia / Fundação", address: "Av. Alfredo Lisboa, s/n - Armazém 19 - Recife Antigo, Recife", lat: -8.0600, lng: -34.8670, phone: "(81) 3182-9500", contactName: "Claudia Beltrão", email: "artesanato@desenvolvimento.pe.gov.br", status: "operacional", tickets: [] },
    { id: 57, name: "Companhia Estadual de Habitação e Obras (CEHAB)", category: "Empresa Pública", address: "Rua Odorico Mendes, 700 - Campo Grande, Recife", lat: -8.0380, lng: -34.8880, phone: "(81) 3183-7100", contactName: "Bruno Lisboa", email: "cehab@cehab.pe.gov.br", status: "operacional", tickets: [] },
    { id: 58, name: "Instituto Agronômico de Pernambuco (IPA)", category: "Autarquia / Fundação", address: "Av. General San Martin, 1371 - Bongi, Recife", lat: -8.0720, lng: -34.9150, phone: "(81) 3184-7200", contactName: "Joaquim Neto", email: "ipa@ipa.pe.gov.br", status: "operacional", tickets: [] },
    { id: 59, name: "Agência de Defesa e Fiscalização Agropecuária (ADAGRO)", category: "Autarquia / Fundação", address: "Av. General San Martin, 1371 - Bongi, Recife", lat: -8.0725, lng: -34.9155, phone: "(81) 3184-7400", contactName: "Paulo Roberto", email: "adagro@adagro.pe.gov.br", status: "operacional", tickets: [] },
    { id: 60, name: "Secretaria de Meio Ambiente, Sustentabilidade e Fernando de Noronha (SEMAS)", category: "Secretaria", address: "Av. Cruz Cabugá, 1111 - Santo Amaro, Recife", lat: -8.0460, lng: -34.8755, phone: "(81) 3181-2800", contactName: "Ana Luiza", email: "semas@semas.pe.gov.br", status: "operacional", tickets: [] },
    { id: 61, name: "Conselho Estadual de Educação (CEE-PE)", category: "Autarquia / Fundação", address: "Rua da Alegria, 432 - Boa Vista, Recife", lat: -8.0550, lng: -34.8850, phone: "(81) 3183-9800", contactName: "Ricardo Aragão", email: "cee@educacao.pe.gov.br", status: "operacional", tickets: [] },
    { id: 62, name: "Compesa - Loja de Atendimento Derby", category: "Empresa Pública", address: "Praça do Derby, s/n - Derby, Recife", lat: -8.0535, lng: -34.8965, phone: "0800 081 0195", contactName: "Marcos Vinicius", email: "derby@compesa.com.br", status: "operacional", tickets: [] },
    { id: 63, name: "Compesa - Loja de Atendimento Boa Vista", category: "Empresa Pública", address: "Rua do Hospício, 200 - Boa Vista, Recife", lat: -8.0590, lng: -34.8860, phone: "0800 081 0195", contactName: "Vanessa Lima", email: "boavista@compesa.com.br", status: "operacional", tickets: [] },
    { id: 64, name: "Detran - Unidade Shopping Tacaruna", category: "Órgão de Segurança e Trânsito", address: "Av. Agamenon Magalhães, 153 - Santo Amaro, Recife", lat: -8.0370, lng: -34.8730, phone: "(81) 3184-8400", contactName: "Carla Bezerra", email: "tacaruna@detran.pe.gov.br", status: "operacional", tickets: [] },
    { id: 65, name: "Secretaria de Habitação do Recife", category: "Secretaria", address: "Cais do Apolo, 925 - Recife Antigo, Recife", lat: -8.0628, lng: -34.8725, phone: "(81) 3355-1600", contactName: "Eriberto Rafael", email: "habitacao@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 66, name: "Secretaria de Trabalho e Qualificação Profissional", category: "Secretaria", address: "Rua da Imperatriz, 39 - Boa Vista, Recife", lat: -8.0600, lng: -34.8830, phone: "(81) 3183-7000", contactName: "Álvaro Jordão", email: "trabalho@trabalho.pe.gov.br", status: "operacional", tickets: [] },
    { id: 67, name: "Secretaria de Esportes do Recife", category: "Secretaria", address: "Av. Mascarenhas de Morais, 2470 - Imbiribeira, Recife", lat: -8.1050, lng: -34.9120, phone: "(81) 3355-8300", contactName: "Rodrigo Coutinho", email: "esportes@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 68, name: "Secretaria de Cultura do Recife", category: "Secretaria", address: "Av. Rio Branco, 155 - Recife Antigo, Recife", lat: -8.0622, lng: -34.8715, phone: "(81) 3355-3100", contactName: "Ricardo Mello", email: "cultura@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 69, name: "Fundação de Cultura Cidade do Recife (FCCR)", category: "Autarquia / Fundação", address: "Av. Rio Branco, 155 - Recife Antigo, Recife", lat: -8.0623, lng: -34.8712, phone: "(81) 3355-3120", contactName: "Marcelo Cavalcanti", email: "fccr@recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 70, name: "Hospital das Clínicas da UFPE (Parceria SUS/GOV)", category: "Autarquia / Fundação", address: "Av. Prof. Moraes Rego, 1235 - Cidade Universitária, Recife", lat: -8.0510, lng: -34.9480, phone: "(81) 2126-3600", contactName: "Dr. Hélio Fonseca", email: "ouvidoria@hc.ufpe.br", status: "operacional", tickets: [] },
    { id: 71, name: "Hospital da Restauração (HR)", category: "Autarquia / Fundação", address: "Av. Agamenon Magalhães, s/n - Derby, Recife", lat: -8.0525, lng: -34.8930, phone: "(81) 3181-5500", contactName: "Dra. Deborah Cunha", email: "hr@saude.pe.gov.br", status: "operacional", tickets: [] },
    { id: 72, name: "Hospital da Mulher do Recife", category: "Autarquia / Fundação", address: "Rodovia BR-101, 792 - Curado, Recife", lat: -8.0850, lng: -34.9580, phone: "(81) 3184-7500", contactName: "Dra. Isabela Coutinho", email: "hmr@saude.recife.pe.gov.br", status: "operacional", tickets: [] },
    { id: 73, name: "UPA 24h Imbiribeira", category: "Autarquia / Fundação", address: "Av. Mascarenhas de Morais, 4390 - Imbiribeira, Recife", lat: -8.1180, lng: -34.9190, phone: "(81) 3184-9000", contactName: "Gerência Médica", email: "upaimbiribeira@saude.pe.gov.br", status: "operacional", tickets: [] },
    { id: 74, name: "UPA 24h Caxangá", category: "Autarquia / Fundação", address: "Av. Caxangá, 3840 - Caxangá, Recife", lat: -8.0410, lng: -34.9420, phone: "(81) 3184-9200", contactName: "Gerência Médica", email: "upacaxanga@saude.pe.gov.br", status: "operacional", tickets: [] },
    { id: 75, name: "Centro de Operações de Recife (COR)", category: "Autarquia / Fundação", address: "Cais do Apolo, 925 - Recife Antigo, Recife", lat: -8.0631, lng: -34.8723, phone: "(81) 3355-8000", contactName: "Coronel Moraes", email: "cor@recife.pe.gov.br", status: "operacional", tickets: [] }
];

let unitsData = JSON.parse(JSON.stringify(baseUnitsData));
let map;
let markersClusterGroup;
let unitMarkers = {};
let activeTickets = [];
let simulationActive = true;
let simulationInterval;
let selectedUnitId = null;
let activeTab = 'units';

let db, auth, userId;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'governo-digital-pe-recife';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    apiKey: "AIzaSyDummyKeyForGitHubPagesTemplateIfRequired",
    authDomain: "governo-digital-pe.firebaseapp.com",
    projectId: "governo-digital-pe",
    storageBucket: "governo-digital-pe.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:123456:web:abcd"
};

const incidentTemplates = [
    { type: "Falha de Rede / Internet", desc: "Instabilidade na conexão MPLS e queda no acesso aos sistemas corporativos estaduais.", severity: "high" },
    { type: "Indisponibilidade de API de Serviços", desc: "API de emissão de certidões e protocolos digitais retornando erro 502 Gateway Timeout.", severity: "high" },
    { type: "Queda de Energia no Prédio", desc: "Falta de energia elétrica na região. Sistema operando em no-break por tempo limitado.", severity: "medium" },
    { type: "Suporte de Hardware (Atendimento)", desc: "Estação de atendimento ao cidadão com terminal de autoatendimento travado.", severity: "low" },
    { type: "Falha no Sistema de Biometria", desc: "Leitores biométricos do balcão de atendimento sem comunicação com a base central.", severity: "medium" }
];

window.onload = async function() {
    initMap();
    initFirebaseAndSync();
    renderUnitsList();
    lucide.createIcons();

    simulationInterval = setInterval(triggerRandomIncident, 14000);
};

async function initFirebaseAndSync() {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }

        userId = auth.currentUser ? auth.currentUser.uid : crypto.randomUUID();
        document.getElementById('user-id-display').innerText = `ID: ${userId.substring(0, 8)}...`;
        
        document.getElementById('firebase-ping').className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
        document.getElementById('firebase-dot').className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500";
        document.getElementById('firebase-text').innerText = "Firebase Conectado (Nuvem Ativa)";
        document.getElementById('firebase-status-badge').classList.remove('hidden');

        const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'tickets_store');
        onSnapshot(colRef, (snapshot) => {
            let cloudTickets = [];
            snapshot.forEach(docSnap => {
                cloudTickets.push(docSnap.data());
            });

            if (cloudTickets.length > 0) {
                syncCloudTicketsToLocal(cloudTickets);
            }
        }, (error) => {
            console.error("Firestore sync error:", error);
        });

    } catch (e) {
        console.warn("Firebase running in offline/local mock mode:", e);
        document.getElementById('firebase-text').innerText = "Modo Local (Offline)";
        document.getElementById('firebase-dot').className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500";
        document.getElementById('firebase-status-badge').classList.remove('hidden');
    }
}

function syncCloudTicketsToLocal(cloudTickets) {
    unitsData.forEach(u => u.tickets = []);
    activeTickets = [];

    cloudTickets.forEach(ticket => {
        const unit = unitsData.find(u => u.id === ticket.unitId);
        if (unit) {
            if (!unit.tickets) unit.tickets = [];
            unit.tickets.push(ticket);
        }
        activeTickets.push(ticket);
    });

    unitsData.forEach(u => updateUnitMarkerAppearance(u.id));
    renderUnitsList();
    if (activeTab === 'tickets') renderTicketsList();
}

async function saveTicketToFirestore(ticket) {
    if (!db) return;
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'tickets_store', String(ticket.id));
        await setDoc(docRef, ticket);
    } catch (err) {
        console.error("Error saving ticket to cloud:", err);
    }
}

function initMap() {
    map = L.map('map', { zoomControl: false }).setView([-8.053, -34.885], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Using official free OpenStreetMap tiles instead of CARTO to avoid API Key requirements
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markersClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false
    });

    unitsData.forEach(unit => {
        const marker = createUnitMarker(unit);
        unitMarkers[unit.id] = { marker, unit };
        markersClusterGroup.addLayer(marker);
    });

    map.addLayer(markersClusterGroup);
}

function createUnitMarker(unit) {
    const hasActiveTicket = unit.tickets && unit.tickets.some(t => t.status === 'ativo');
    const markerColor = hasActiveTicket ? '#dc2626' : '#10b981';
    const pulseClass = hasActiveTicket ? 'pulse-marker' : '';

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md transition transform hover:scale-110 ${pulseClass}" style="background-color: ${markerColor}; border: 2px solid white;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
               </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });

    const marker = L.marker([unit.lat, unit.lng], { icon: customIcon });

    const popupContent = `
        <div class="p-2 max-w-xs font-sans">
            <div class="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-0.5">${unit.category}</div>
            <h3 class="font-bold text-sm text-slate-800 mb-1 leading-tight">${unit.name}</h3>
            <p class="text-xs text-slate-500 mb-2">${unit.address}</p>
            <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                <span class="text-xs font-semibold ${hasActiveTicket ? 'text-rose-600' : 'text-emerald-600'}">
                    ${hasActiveTicket ? '⚠️ Chamado Ativo' : '✔ Operacional'}
                </span>
                <button onclick="window.openUnitModalFromGlobal(${unit.id})" class="bg-brand-600 hover:bg-brand-700 text-white px-2.5 py-1 rounded text-xs font-medium transition">
                    Detalhes
                </button>
            </div>
        </div>
    `;
    marker.bindPopup(popupContent);
    return marker;
}

window.openUnitModalFromGlobal = function(id) {
    openUnitModal(id);
}

function renderUnitsList() {
    const container = document.getElementById('units-list-container');
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    const filtered = unitsData.filter(unit => {
        const matchesSearch = unit.name.toLowerCase().includes(searchQuery) || unit.address.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryFilter === 'all' || unit.category === categoryFilter;
        const hasActive = unit.tickets && unit.tickets.some(t => t.status === 'ativo');
        const matchesStatus = statusFilter === 'all' || 
                              (statusFilter === 'operacional' && !hasActive) || 
                              (statusFilter === 'alerta' && hasActive);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    document.getElementById('units-count-badge').innerText = filtered.length;
    document.getElementById('stats-units-total').innerText = `${unitsData.length} órgãos cadastrados`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 px-4">
                <i data-lucide="search-x" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
                <p class="text-xs font-medium text-slate-500">Nenhum órgão encontrado com esses filtros.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = filtered.map(unit => {
        const hasActive = unit.tickets && unit.tickets.some(t => t.status === 'ativo');
        return `
            <div onclick="window.focusUnitOnMapGlobal(${unit.id})" class="p-3 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl cursor-pointer transition shadow-sm flex items-start justify-between group">
                <div class="space-y-1 pr-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasActive ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                            ${hasActive ? 'Com Chamado' : 'Operacional'}
                        </span>
                        <span class="text-[10px] text-slate-400 uppercase font-medium">${unit.category}</span>
                    </div>
                    <h4 class="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition leading-tight">${unit.name}</h4>
                    <p class="text-[11px] text-slate-500 truncate max-w-[240px]">${unit.address}</p>
                </div>
                <button onclick="event.stopPropagation(); window.openUnitModalFromGlobal(${unit.id})" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

window.filterUnits = function() { renderUnitsList(); }

window.focusUnitOnMapGlobal = function(unitId) {
    const item = unitMarkers[unitId];
    if (item) {
        map.setView([item.unit.lat, item.unit.lng], 16, { animate: true });
        item.marker.openPopup();
        if (window.innerWidth < 1024) {
            document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

window.openUnitModal = function(unitId) {
    selectedUnitId = unitId;
    const unit = unitsData.find(u => u.id === unitId);
    if (!unit) return;

    const activeTicketsList = unit.tickets ? unit.tickets.filter(t => t.status === 'ativo') : [];
    const hasActive = activeTicketsList.length > 0;

    document.getElementById('modal-title').innerText = unit.name;
    document.getElementById('modal-category-badge').innerText = unit.category;
    document.getElementById('modal-address').querySelector('span').innerText = unit.address;
    document.getElementById('modal-contact-name').innerText = unit.contactName;
    document.getElementById('modal-contact-email').innerText = unit.email;
    document.getElementById('modal-phone').innerText = unit.phone;
    document.getElementById('modal-tickets-count').innerText = unit.tickets ? unit.tickets.length : 0;

    const statusBadge = document.getElementById('modal-status-badge');
    if (hasActive) {
        statusBadge.className = "bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full";
        statusBadge.innerText = "Chamado Ativo";
    } else {
        statusBadge.className = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full";
        statusBadge.innerText = "Operacional";
    }

    const ticketsListEl = document.getElementById('modal-tickets-list');
    if (!unit.tickets || unit.tickets.length === 0) {
        ticketsListEl.innerHTML = `
            <div class="text-center py-4 bg-white rounded-xl border border-slate-200/80">
                <p class="text-xs text-slate-400">Nenhum chamado registrado para este órgão.</p>
            </div>
        `;
    } else {
        ticketsListEl.innerHTML = unit.tickets.map(ticket => `
            <div class="bg-white p-3 rounded-xl border ${ticket.status === 'ativo' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'} shadow-sm flex items-start justify-between">
                <div class="space-y-1 pr-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'ativo' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                            ${ticket.status === 'ativo' ? 'Aberto' : 'Resolvido'}
                        </span>
                        <span class="text-[10px] text-slate-400">${ticket.time}</span>
                    </div>
                    <h5 class="text-xs font-bold text-slate-800">${ticket.title}</h5>
                    <p class="text-[11px] text-slate-600">${ticket.description}</p>
                </div>
                ${ticket.status === 'ativo' ? `
                    <button onclick="window.resolveTicketGlobal(${ticket.id})" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-lg transition flex-shrink-0 shadow-sm">
                        Resolver
                    </button>
                ` : ''}
            </div>
        `).join('');
    }

    document.getElementById('modal-navigate-btn').onclick = function() {
        window.closeModal();
        window.focusUnitOnMapGlobal(unit.id);
    };

    document.getElementById('unit-modal').classList.remove('hidden');
    lucide.createIcons();
}

window.closeModal = function() {
    document.getElementById('unit-modal').classList.add('hidden');
    selectedUnitId = null;
}

async function createTicketForUnit(unitId, title, description, severity) {
    const unit = unitsData.find(u => u.id === unitId);
    if (!unit) return;

    const ticket = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        unitId: unit.id,
        unitName: unit.name,
        title: title,
        description: description,
        severity: severity,
        status: 'ativo',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!unit.tickets) unit.tickets = [];
    unit.tickets.unshift(ticket);
    activeTickets.unshift(ticket);

    updateUnitMarkerAppearance(unit.id);
    renderUnitsList();
    if (activeTab === 'tickets') renderTicketsList();

    await saveTicketToFirestore(ticket);
    showToast(unit.name, title);
}

function triggerRandomIncident() {
    if (!simulationActive) return;
    const randomUnit = unitsData[Math.floor(Math.random() * unitsData.length)];
    const randomIncident = incidentTemplates[Math.floor(Math.random() * incidentTemplates.length)];
    createTicketForUnit(randomUnit.id, randomIncident.type, randomIncident.desc, randomIncident.severity);
}

window.toggleSimulation = function() {
    simulationActive = !simulationActive;
    const btnText = document.getElementById('sim-btn-text');
    const btn = document.getElementById('toggle-sim-btn');
    if (simulationActive) {
        btnText.innerText = "Pausar Simulação";
        btn.className = "flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm";
    } else {
        btnText.innerText = "Retomar Simulação";
        btn.className = "flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm";
    }
}

window.openTicketForCurrentUnit = function() {
    if (!selectedUnitId) return;
    const randomIncident = incidentTemplates[Math.floor(Math.random() * incidentTemplates.length)];
    createTicketForUnit(selectedUnitId, randomIncident.type, randomIncident.desc, randomIncident.severity);
    window.openUnitModal(selectedUnitId);
}

window.resolveTicketGlobal = async function(ticketId) {
    let targetTicket = null;
    for (let unit of unitsData) {
        if (unit.tickets) {
            const t = unit.tickets.find(item => item.id === ticketId);
            if (t) {
                t.status = 'resolvido';
                targetTicket = t;
                updateUnitMarkerAppearance(unit.id);
            }
        }
    }

    if (targetTicket) {
        await saveTicketToFirestore(targetTicket);
    }

    renderUnitsList();
    if (activeTab === 'tickets') renderTicketsList();
    if (selectedUnitId) window.openUnitModal(selectedUnitId);
}

window.resolveAllTickets = async function() {
    for (let unit of unitsData) {
        if (unit.tickets) {
            for (let t of unit.tickets) {
                t.status = 'resolvido';
                await saveTicketToFirestore(t);
            }
        }
        updateUnitMarkerAppearance(unit.id);
    }

    renderUnitsList();
    if (activeTab === 'tickets') renderTicketsList();
    if (selectedUnitId) window.openUnitModal(selectedUnitId);
}

function updateUnitMarkerAppearance(unitId) {
    const item = unitMarkers[unitId];
    if (!item) return;

    markersClusterGroup.removeLayer(item.marker);
    const newMarker = createUnitMarker(item.unit);
    unitMarkers[unitId].marker = newMarker;
    markersClusterGroup.addLayer(newMarker);
}

function renderTicketsList() {
    const container = document.getElementById('tickets-list-container');
    const activeList = activeTickets.filter(t => t.status === 'ativo');

    const badge = document.getElementById('tickets-badge');
    if (activeList.length > 0) {
        badge.innerText = activeList.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    if (activeTickets.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 px-4">
                <i data-lucide="check-circle-2" class="w-10 h-10 text-emerald-400 mx-auto mb-2"></i>
                <p class="text-xs font-medium text-slate-500">Nenhum incidente ativo no momento. Todos os órgãos operando normalmente.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = activeTickets.map(ticket => `
        <div onclick="window.focusUnitOnMapGlobal(${ticket.unitId})" class="p-3 bg-white hover:bg-slate-50 border ${ticket.status === 'ativo' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100'} rounded-xl cursor-pointer transition shadow-sm space-y-1.5">
            <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'ativo' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                    ${ticket.status === 'ativo' ? 'Ativo' : 'Resolvido'}
                </span>
                <span class="text-[10px] text-slate-400">${ticket.time}</span>
            </div>
            <h5 class="text-xs font-bold text-slate-800">${ticket.unitName}</h5>
            <p class="text-[11px] font-semibold text-rose-600">${ticket.title}</p>
            <p class="text-[11px] text-slate-500">${ticket.description}</p>
            ${ticket.status === 'ativo' ? `
                <div class="pt-2 flex justify-end">
                    <button onclick="event.stopPropagation(); window.resolveTicketGlobal(${ticket.id})" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-lg transition shadow-sm">
                        Marcar como Resolvido
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');

    lucide.createIcons();
}

window.switchTab = function(tabName) {
    activeTab = tabName;
    const unitsBtn = document.getElementById('tab-units-btn');
    const ticketsBtn = document.getElementById('tab-tickets-btn');
    const unitsContent = document.getElementById('tab-units-content');
    const ticketsContent = document.getElementById('tab-tickets-content');

    if (tabName === 'units') {
        unitsBtn.className = "flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-white text-brand-700 shadow-sm border border-slate-200/80 flex items-center justify-center space-x-1.5 transition";
        ticketsBtn.className = "flex-1 py-2 px-3 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center space-x-1.5 transition relative";
        unitsContent.classList.remove('hidden');
        ticketsContent.classList.add('hidden');
    } else {
        ticketsBtn.className = "flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-white text-brand-700 shadow-sm border border-slate-200/80 flex items-center justify-center space-x-1.5 transition";
        unitsBtn.className = "flex-1 py-2 px-3 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center space-x-1.5 transition";
        ticketsContent.classList.remove('hidden');
        unitsContent.classList.add('hidden');
        renderTicketsList();
    }
}

function showToast(unitName, incidentTitle) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = "pointer-events-auto bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 flex items-start space-x-3 transform transition-all translate-y-4 opacity-0";
    
    toast.innerHTML = `
        <div class="p-2 bg-rose-500 text-white rounded-lg flex-shrink-0 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Alerta Sincronizado na Nuvem</span>
                <span class="text-[10px] text-slate-400">Agora</span>
            </div>
            <h5 class="text-xs font-bold leading-snug">${unitName}</h5>
            <p class="text-[11px] text-slate-300 line-clamp-1">${incidentTitle}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
    `;

    container.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-y-4', 'opacity-0'); }, 50);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
    }, 6000);
}

window.resetMapView = function() {
    map.setView([-8.053, -34.885], 13, { animate: true });
}