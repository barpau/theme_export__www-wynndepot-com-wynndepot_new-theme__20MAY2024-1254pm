(function () {
	/* Toggle content */
	$('.product-description-more').click(function (e) {
		e.preventDefault();
		$(this).closest('.product-description-short').next().show();
		$(this).closest('.product-description-short').hide();
	});

	$('.product-description-less').click(function (e) {
		e.preventDefault();
		$(this).closest('.product-description-full').prev().show();
		$(this).closest('.product-description-full').hide();
	});

	/* Toggle fields */
	$('.js-show-more').click(function (e) {
		e.preventDefault();
		$(this).siblings('input').removeClass('hidden');
		$(this).siblings('label').removeClass('hidden');
		$(this).remove();
	});
})();

/* Second floated product form */
class FloatedForm extends HTMLElement {
	constructor() {
		super();
		this.renderForm();
	}

	renderForm() {
		fetch(this.getAttribute('data-product-url'))
			.then((response) => response.text())
			.then((responseText) => {
				const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
				this.productElement = responseHTML.querySelector('div[id^="ProductInfo-"]');

				this.preventDuplicatedIDs();
				this.removeDOMElements();
				this.setInnerHTML(this, this.productElement.innerHTML);

				if (window.Shopify && Shopify.PaymentButton) {
					Shopify.PaymentButton.init();
				}

				if (window.ProductModel) window.ProductModel.loadShopifyXR();

				this.showMoreFields();
			})
	}

	setInnerHTML(element, html) {
		element.innerHTML = html;

		// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
		element.querySelectorAll('script').forEach(oldScriptTag => {
			const newScriptTag = document.createElement('script');
			Array.from(oldScriptTag.attributes).forEach(attribute => {
				newScriptTag.setAttribute(attribute.name, attribute.value)
			});
			newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
			oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
		});
	}

	preventDuplicatedIDs() {
		const sectionId = this.productElement.dataset.section;
		this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(sectionId, `floated-${ sectionId }`);

		if (this.productElement.querySelectorAll('variant-selects')) {
			this.productElement.querySelectorAll('variant-selects').forEach(radio => {
				radio.dataset.originalSection = sectionId;
			});
		}

		if (this.productElement.querySelectorAll('variant-radios')) {
			this.productElement.querySelectorAll('variant-radios').forEach(radio => {
				radio.dataset.originalSection = sectionId;
			});
		}
	}

	removeDOMElements() {
		const text = this.productElement.querySelector('.product__text');
		if (text) text.remove();

		const shareButtons = this.productElement.querySelector('.share-buttons');
		if (shareButtons) shareButtons.remove();

		const rating = this.productElement.querySelector('.rating');
		if (rating) rating.remove();

		const tags = this.productElement.querySelector('.product-tags');
		if (tags) tags.remove();

		const description = this.productElement.querySelector('.product__description');
		if (description) description.remove();

		const advantages = this.productElement.querySelectorAll('.advantage');
		advantages.forEach(advantage => {
			advantage.remove();
		});

		const note = this.productElement.querySelector('.note');
		if (note) note.remove();

		const promoBanner = this.productElement.querySelector('.promo-banner');
		if (promoBanner) promoBanner.remove();

		const pickupAvailability = this.productElement.querySelector('pickup-availability');
		if (pickupAvailability) pickupAvailability.remove();

		const productModal = this.productElement.querySelector('product-modal');
		if (productModal) productModal.remove();

		const productForm = this.productElement.querySelector('floated-form');
		if (productForm) productForm.remove();

		const relatedProduct = this.productElement.querySelector('related-product');
		if (relatedProduct) relatedProduct.remove();

		const gift = this.productElement.querySelector('.customer');
		if (gift) gift.remove();

		const customLiquid = this.productElement.querySelector('.custom-liquid');
		if (customLiquid) customLiquid.remove();
	}

	showMoreFields() {
		$('.js-show-more').click(function (e) {
			e.preventDefault();
			$(this).siblings('input').removeClass('hidden');
			$(this).siblings('label').removeClass('hidden');
			$(this).remove();
		});
	}
}

customElements.define('floated-form', FloatedForm);

document.addEventListener('DOMContentLoaded', function() {
  var productJsonElement = document.querySelector('script[type="application/json"]');
  if (!productJsonElement) {
    console.error("Product JSON element not found");
    return;
  }

  var productJson = JSON.parse(productJsonElement.textContent);
  console.log("Product JSON:", productJson);

  var variantRadioButtons = document.querySelectorAll('input[name="id"]');
  if (variantRadioButtons.length === 0) {
    console.error("Variant radio buttons not found");
    return;
  }

  // Function to update SKU
  function _updateSKU(variant) {
    var skuElement = document.getElementById('variant-sku');
    if (skuElement) {
      skuElement.textContent = variant.sku;
      console.log("SKU updated to:", variant.sku);
    } else {
      console.error("SKU element not found");
    }
  }

  // Function to handle variant change
  function _onSelectChange(event) {
    var selectedVariantId = event.target.value;
    var selectedVariant = productJson.variants.find(variant => variant.id == selectedVariantId);

    if (selectedVariant) {
      // Update price (assuming this is handled elsewhere)
      // this._updatePrice(selectedVariant);

      // Update SKU
      _updateSKU(selectedVariant);
    } else {
      console.error("Selected variant not found");
    }
  }

  // Add event listeners to variant radio buttons
  variantRadioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', _onSelectChange);
  });

  // Initial SKU update on page load
  var initialVariantId = document.querySelector('input[name="id"]:checked').value;
  var initialVariant = productJson.variants.find(variant => variant.id == initialVariantId);
  if (initialVariant) {
    _updateSKU(initialVariant);
  }
});

