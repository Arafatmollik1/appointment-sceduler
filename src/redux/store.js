import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import { persistStore } from 'redux-persist'
import { persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userReducer } from './user/user.reducer.js'
import { dataReducer } from './data/data.reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './root.sagas.js'
import storage from 'redux-persist/lib/storage'

const rootReducers = combineReducers({
  userReducer,
  dataReducer,
})
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userReducer'],
}
const pReducer = persistReducer(persistConfig, rootReducers)

const logger = createLogger()
const sagaMiddleware = createSagaMiddleware()
const middleWares = [logger, sagaMiddleware]

export const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(...middleWares))
)
sagaMiddleware.run(rootSaga)

export const persistor = persistStore(store)
