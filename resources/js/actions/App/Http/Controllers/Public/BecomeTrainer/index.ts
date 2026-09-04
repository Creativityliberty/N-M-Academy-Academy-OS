import TrainerPlanController from './TrainerPlanController'
import CheckoutController from './CheckoutController'
import PaymentController from './PaymentController'

const BecomeTrainer = {
    TrainerPlanController: Object.assign(TrainerPlanController, TrainerPlanController),
    CheckoutController: Object.assign(CheckoutController, CheckoutController),
    PaymentController: Object.assign(PaymentController, PaymentController),
}

export default BecomeTrainer