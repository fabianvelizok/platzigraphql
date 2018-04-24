const casual = require('casual');
const { makeExecutableSchema } = require('graphql-tools')

const { Course, Teacher } = require('./models')

const typeDefs = `
  # This is a course. It belongs to a teacher
  type Course {
    id: ID!
    title: String!
    description: String!
    teacher: Teacher
    rating: Float @deprecated(reason: "No longer used")
    # Course comments
    comments: [Comment]
  }

  # This is a teacher. It has many courses
  type Teacher {
    id: ID!
    name: String!
    country: String!
    gender: Gender
    courses: [Course]
  }

  enum Gender {
    MALE
    FEMALE
  }

  type Comment {
    id: ID!
    # Author name
    name: String!
    body: String!
  }

  type Query {
    courses: [Course]
    teachers: [Teacher]
    course(id: Int): Course
    teacher(id: Int): Teacher
  }
`

const resolvers = {
  Query: {
    courses: () => Course.query().eager('[teacher]'), // @FIXME: Comment relationship
    teachers: () => Teacher.query().eager('[courses]'),
    course: (rootValue, args) => Course.query().eager('[teacher]').findById(args.id), // @FIXME: Comment relationship
    teacher: (rootValue, args) => Teacher.query().eager('[courses]').findById(args.id)
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

module.exports = schema
