import React, { useState, useEffect, useRef } from 'react'
import { Markdown } from 'react-showdown'
import { Route, Switch, NavLink, Redirect } from 'react-router-dom'

import * as games from 'p3demos/games'


// Main React component.
export default function RootComponent() {
  const gameWrapper = useRef(null)
  const [game, setGame] = useState({
    name: undefined,
    instance: undefined
  })

  useEffect(() => {
    if (!game.name) return

    // Our Phaser games hook into #p3demo-wrapper, cf. src/config.ts
    // We specifically don't want to trigger a re-render so not using setGame.
    game.instance = new games[game.name]

    return function destroyGame() {
      if (game.instance) {
        game.instance.destroy()
        game.instance = undefined
        gameWrapper.current.innerHTML = ''
      }
    }
  })

  return (
    <div className="p3demos">
      <div className="p3demos-list">
        <h1 className="p3demos-item  p3demos-item--title">Démos Phaser 3</h1>
        {
          Object.keys(games).map((moduleName) => {
            const gameModule = games[moduleName]
            return (
              <NavLink
                className="p3demos-item"
                key={moduleName}
                activeClassName='p3demos-item--active'
                exact
                to={`/demos/${moduleName}`}
                onClick={() => {
                  setGame({ name: moduleName, instance: undefined })
                }}
              >
                {gameModule.gameName}
              </NavLink>
            )
          })
        }
      </div>
      <Switch>
        <Route
          path="/demos/:name"
          render={({ match }) => {
            return (
              <React.Fragment>
                <div ref={gameWrapper} id="p3demos-wrapper"></div>
                { game.name && <div className="p3demos-desc">
                    <Markdown markup={games[game.name].desc} />
                  </div>
                }
              </React.Fragment>
            )
          }}
        />
      </Switch>
    </div>
  )
}