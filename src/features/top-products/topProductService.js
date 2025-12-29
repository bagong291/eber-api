class TopProductService {
  constructor(topProductRepository) {
    this.topProductRepository = topProductRepository;
  }

  async listTopProducts() {
    return this.topProductRepository.findAll();
  }

  async getTopProductById(id) {
    const topProduct = await this.topProductRepository.findById(id);
    if (!topProduct) {
      throw new Error('Top product not found');
    }
    return topProduct;
  }

  async addTopProduct(productId, rank) {
    // Check if already 10 products
    const count = await this.topProductRepository.count();
    if (count >= 10) {
      throw new Error('Maximum 10 top products allowed. Please remove one before adding.');
    }

    // Check if product already in top products
    const existing = await this.topProductRepository.findByProductId(productId);
    if (existing) {
      throw new Error('Product is already in top 10 list');
    }

    // Check if rank is already taken
    const rankTaken = await this.topProductRepository.findByRank(rank);
    if (rankTaken) {
      throw new Error(`Rank ${rank} is already taken`);
    }

    // Validate rank
    if (rank < 1 || rank > 10) {
      throw new Error('Rank must be between 1 and 10');
    }

    return this.topProductRepository.create({
      product_id: productId,
      rank
    });
  }

  async updateTopProductRank(id, newRank) {
    // Validate rank
    if (newRank < 1 || newRank > 10) {
      throw new Error('Rank must be between 1 and 10');
    }

    const topProduct = await this.topProductRepository.findById(id);
    if (!topProduct) {
      throw new Error('Top product not found');
    }

    const oldRank = topProduct.rank;
    
    // If rank is the same, no need to update
    if (oldRank === newRank) {
      return topProduct;
    }

    // Check if new rank is already taken by another product
    const rankTaken = await this.topProductRepository.findByRank(newRank);
    
    if (rankTaken && rankTaken.id !== id) {
      // Swap ranks using a temporary negative rank to avoid unique constraint violation
      const tempRank = -1; // Temporary rank (negative to bypass validation temporarily)
      
      // Step 1: Set current product to temp rank (bypass validation)
      await topProduct.update({ rank: tempRank }, { validate: false });
      
      // Step 2: Set other product to old rank
      await rankTaken.update({ rank: oldRank });
      
      // Step 3: Set current product to new rank
      await topProduct.update({ rank: newRank });
    } else {
      // No conflict, just update
      await topProduct.update({ rank: newRank });
    }

    return this.topProductRepository.findById(id);
  }

  async removeTopProduct(id) {
    const deleted = await this.topProductRepository.delete(id);
    if (!deleted) {
      throw new Error('Top product not found');
    }

    // Reorder remaining products
    await this.topProductRepository.reorderRanks();
    
    return true;
  }

  async removeByProductId(productId) {
    const count = await this.topProductRepository.deleteByProductId(productId);
    if (count === 0) {
      throw new Error('Product not found in top 10 list');
    }

    // Reorder remaining products
    await this.topProductRepository.reorderRanks();
    
    return true;
  }
}

module.exports = TopProductService;
