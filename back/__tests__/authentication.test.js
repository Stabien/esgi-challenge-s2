/*import { ATTENTIONTemporaireATTENTION } from './utils';

describe('Test de validation de taille du mdp', () => {
  it('mdp < 8 caractères', () => {
    // Mot de passe aléatoire avec moins de 8 caractères
    const passwordShort = 'pass123';

    // On attends que le mdp soit invalide (de par sa taille (8 caractères))
    expect(ATTENTIONTemporaireATTENTION(passwordShort)).toBe(false);
  });

  it('mdp > 8 caractères', () => {
    // Mot de passe aléatoire avec 11 caractères
    const passwordValid = 'password123';

    // On attends que le mdp soit valide (de par sa taille (11 caractères))
    expect(ATTENTIONTemporaireATTENTION(passwordValid)).toBe(true);
  });
});



*/



// __tests__/myPostgresTest.spec.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');


// __tests__/myPostgresTest.spec.js

// Modèle de la table
class User extends Model {}
User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'user',
  }
);

// Fonction à tester
async function fetchUsersFromDatabase() {
  return User.findAll();
}

describe('PostgreSQL Unit Tests', () => {
  beforeAll(async () => {
    // Synchroniser le modèle avec la base de données
    await sequelize.sync();

    // Peupler la table avec des données pour le test
    await User.bulkCreate([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]);
  });

  afterAll(async () => {
    // Supprimer les données après les tests
    await User.destroy({ where: {} });
    await sequelize.close();
  });

  test('fetchUsersFromDatabase should return the correct users', async () => {
    const result = await fetchUsersFromDatabase();
    expect(result).toEqual([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]);
  });
});

// Fonctions CRUD à tester
async function createUser(name, age) {
  return User.create({ name, age });
}

async function getAllUsers() {
  return User.findAll();
}

async function updateUser(id, name, age) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  user.name = name;
  user.age = age;
  return user.save();
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user.destroy();
}

describe('PostgreSQL Unit Tests', () => {
  beforeAll(async () => {
    // Synchroniser le modèle avec la base de données
    await sequelize.sync();
  });

  afterEach(async () => {
    // Supprimer toutes les données après chaque test
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    // Fermer la connexion après les tests
    await sequelize.close();
  });

  test('createUser should add a new user to the database', async () => {
    await createUser('John', 30);
    const users = await getAllUsers();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('John');
    expect(users[0].age).toBe(30);
  });

  test('updateUser should update the user information in the database', async () => {
    const user = await createUser('Jane', 25);
    await updateUser(user.id, 'Jane Doe', 26);
    const updatedUser = await User.findByPk(user.id);
    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.age).toBe(26);
  });

  test('deleteUser should remove the user from the database', async () => {
    const user = await createUser('John', 30);
    await deleteUser(user.id);
    const users = await getAllUsers();
    expect(users).toHaveLength(0);
  });
});
