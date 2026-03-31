import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader } from './Loader/Loader';
import { Person } from '../types/Person';

async function getPeople() {
  const response = await fetch(
    'https://mate-academy.github.io/react_people-table/api/people.json',
  );

  if (!response.ok) {
    throw new Error('Network error');
  }

  return response.json();
}

export const PeoplePage = () => {
  const [peopleData, setPeopleData] = useState<Person[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      setSelectedSlug(slug);
    }
  }, [slug]);
  const renderPerents = (name?: string | null) => {
    if (!name) {
      return '-';
    }

    const p = peopleData?.find(x => x.name === name);

    if (p) {
      return (
        <Link
          to={`/people/${p.slug}`}
          className={p.sex === 'f' ? 'has-text-danger' : ''}
        >
          {name}
        </Link>
      );
    }

    return <span>{name}</span>;
  };

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(data => {
        setPeopleData(data);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="title">People Page</h1>
        {/* {loading && <p>Loading...</p>} */}
        {!loading && error && (
          <p data-cy="peopleLoadingError" className="has-text-danger">
            Something went wrong
          </p>
        )}
        {!loading && peopleData && peopleData.length === 0 && (
          <p data-cy="noPeopleMessage">There are no people on the server</p>
        )}

        {!loading && peopleData && peopleData.length > 0 && (
          <table
            data-cy="peopleTable"
            className="table is-striped is-hoverable is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Sex</th>
                <th>Born</th>
                <th>Died</th>
                <th>Mother</th>
                <th>Father</th>
              </tr>
            </thead>

            <tbody>
              {peopleData?.map(person => (
                <tr
                  key={person.slug}
                  data-cy="person"
                  className={
                    person.slug === selectedSlug ? 'has-background-warning' : ''
                  }
                  onClick={() => setSelectedSlug(person.slug)}
                >
                  <td>
                    <Link
                      to={`/people/${person.slug}`}
                      className={person.sex === 'f' ? 'has-text-danger' : ''}
                    >
                      {person.name}
                    </Link>
                  </td>
                  <td>{person.sex}</td>
                  <td>{person.born}</td>
                  <td>{person.died}</td>
                  <td>{renderPerents(person.motherName)}</td>
                  <td>{renderPerents(person.fatherName)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {loading && (
          <div className="block">
            <div className="box table-container">
              <Loader />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
