import Team from '../../models/team'
import Player from '../../models/player'
import User from '../modules/user/UserModel'

import UserResolver from './user'

export default {
    teams: async () => {
        const teams = await Team.find({})
        return teams
    },
    players: async () => {
        const players = await Player.find({})
        return players
    },
    createTeam: async args => {
        const team = new Team({
            name: args.teamInput.name,
            img: args.teamInput.img
        })
        const newTeam = await team.save()
        return newTeam
    },
    createPlayer: async args => {
        try {
            let player = new Player({
                name: args.playerInput.name
            })

            const newPlayer = await player.save()
            return newPlayer
        } catch (error) {
            
        }
    },
    me: async (args, { user }) => {
        if (!user) {
            throw new Error('You are not authenticated!')
        }

        return await User.findById(user.id)
    },
    login: async (args) => {
        console.log('login')
        const user = await User.findOne({ where: { email: args.loginInput.email } })

        if (!user) {
            throw new Error('No user with that e-mail')
        }

        const valid = await bcrypt.compare(args.loginInput.password, user.password)

        if (!valid) {
            throw new Error('Incorrect password')
        }

        return jsonwebtoken.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        )
    },
    signup: async args => {
        console.log('signup', args)
        const user = await User.create({
            name: args.signupIput.name,
            username: args.signupIput.username,
            email:args.signupIput.email,
            password: await bcrypt.hash(args.signupIput.password, 10)
        })

        // return json web token
        return jsonwebtoken.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        )
    }
}