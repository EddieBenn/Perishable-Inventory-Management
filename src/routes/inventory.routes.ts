import { Router } from 'express';
import inventoryController from '../controllers/inventory.controller';


const router = Router();

router.post('/:item/add', inventoryController.addInventory);
router.post('/:item/sell', inventoryController.sellItem);
router.get('/:item/quantity', inventoryController.getQuantity);

export { router as inventoryRouter };