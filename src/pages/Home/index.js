import { useEffect, useState, useMemo, useCallback } from 'react';

import { Link } from 'react-router-dom';

import ContactsService from '../../services/ContactsService';

import Loader from '../../components/Loader';
import Button from '../../components/Button';

import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
import sad from '../../assets/images/icons/sad.svg';
import emptyBox from '../../assets/images/icons/empty-box.svg';
import magnifierQuestion from '../../assets/images/icons/magnifier-question.svg';

import {
  Container,
  InputSearchContainer,
  Header,
  ListHeader,
  Card,
  ErrorContainer,
  EmptyListContainer,
  SearchNotFoundContainer
} from './styles';


export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState({ haserror: false, error: '' });

  const filteredContacts = useMemo(() => (
    contacts.filter((contact) => (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  ), [contacts, searchTerm]);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);

      const contactsList = await ContactsService.listContacts(orderBy);

      setContacts(contactsList);
      setHasError({ haserror: false })
    } catch (error) {
      setHasError({ haserror: true, error })
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  function handleToggleOrderBy() {
    setOrderBy((prevState) => (
      prevState === 'asc' ? 'desc' : 'asc'
    ))
  }

  function handleChangeSearchTerm(event) {
    setSearchTerm(event.target.value)
  }

  function handleTryAgain() {
    loadContacts()
  }

  return (
    <Container>
      <Loader isLoading={isLoading} />

      {contacts.length > 0 && (
        <InputSearchContainer>
          <input
            value={searchTerm}
            type='text'
            placeholder='Pesquisar contato...'
            onChange={handleChangeSearchTerm}
          />
        </InputSearchContainer>
      )}

      <Header
        justifyContent={
          hasError.haserror ?
          'flex-end'
          : (
            contacts.length > 0 ?
            'space-between'
            : 'center'
          )
        }
      >
        {(!hasError.haserror && contacts.length > 0) && (
          <strong>
            {filteredContacts.length}
            {filteredContacts.length === 1 ? ' contato' : ' contatos'}
          </strong>
        )}

        <Link to='/new'>Novo contato</Link>
      </Header>

      {hasError.haserror && (
        <ErrorContainer>
          <img src={sad} alt="Sad" />

          <div className="details">
            <strong>{`Erro ${hasError.error.message}`}</strong>

            <Button
              type="button"
              onClick={handleTryAgain}
            >
              Tentar novamente
            </Button>
          </div>
        </ErrorContainer>
      )}

      {!hasError.haserror && (
        <>
          {(contacts.length < 1 && !isLoading) && (
            <EmptyListContainer>
              <img src={emptyBox} alt="Empty box" />

              <p>
                Você ainda não tem nenhum contato cadastrado!
                Clique no botão <strong>”Novo contato”</strong> à cima
                para cadastrar o seu primeiro!
              </p>
            </EmptyListContainer>
          )}

          {(contacts.length > 0 && filteredContacts.length < 1) && (
            <SearchNotFoundContainer>
              <img src={magnifierQuestion} alt="Magnifier question" />

              <span>
                Nenhum resultado foi encontrado para <strong>{searchTerm}</strong>.
              </span>
            </SearchNotFoundContainer>
          )}

          {filteredContacts.length > 0 && (
            <ListHeader orderBy={orderBy}>
              <button type='button' onClick={handleToggleOrderBy}>
                <span>Nome</span>
                <img src={arrow} alt='Order' />
              </button>
            </ListHeader>
          )}

          {filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <div className='info'>
                <div className='contact-name'>
                  <strong>{contact.name}</strong>
                  {contact.category_name && (
                    <small>{contact.category_name}</small>
                  )}
                </div>

                <span>{contact.email}</span>
                <span>{contact.phone}</span>
              </div>

              <div className='actions'>
                <Link to={`/edit/${contact.id}`}>
                  <img src={edit} alt='Edit' />
                </Link>

                <button type='button'>
                  <img src={trash} alt='Delete' />
                </button>
              </div>
            </Card>
          ))}
        </>
      )}

    </Container>
  );
}
